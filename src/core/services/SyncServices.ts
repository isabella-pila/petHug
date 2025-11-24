import NetInfo from '@react-native-community/netinfo';
import DatabaseConnection from '../infra/sqlite/connection'; 

// REPOSITÓRIOS
import { SupabaseUserRepository } from '../infra/repositories/supabaseUserRepository';
import { SupabasePetPerfilRepository } from '../infra/repositories/supabasePetRepository'; // Verifique o nome do arquivo
import { IUserRepository } from '../domain/repositories/UserRepository';
import { IPetPerfilRepository } from '../domain/repositories/PetPerfilRepository';

// ENTIDADES E VALUE OBJECTS
import { User } from '../domain/entities/User';
import { PetPerfil } from '../domain/entities/PetPerfil';
import { Name } from '../domain/value-objects/Name';
import { Email } from '../domain/value-objects/Email';
import { Password } from '../domain/value-objects/Password';
import { GeoCoordinates } from '../domain/value-objects/GeoCoordinates';
import { Photo } from '../domain/value-objects/Photo';

// FACTORIES
import { makePetPerfilUseCases } from '../factories/MakePetPerfilRepository';

export class SyncService {
  private static instance: SyncService;
  private isSyncing: boolean = false;
  
  private userRepository: IUserRepository;
  private petRepository: IPetPerfilRepository;

  private constructor(
    userRepository: IUserRepository,
    petRepository: IPetPerfilRepository
  ) {
    this.userRepository = userRepository;
    this.petRepository = petRepository;

    // Escuta mudanças na conexão para tentar sincronizar automaticamente
    NetInfo.addEventListener(state => {
      if (state.isConnected && !this.isSyncing) {
        this.syncAllPendingChanges();
      }
    });
  }

  public static getInstance(
    userRepository: IUserRepository = SupabaseUserRepository.getInstance(),
    petRepository: IPetPerfilRepository = SupabasePetPerfilRepository.getInstance()
  ): SyncService {
    if (!SyncService.instance) {
      SyncService.instance = new SyncService(userRepository, petRepository);
    }
    return SyncService.instance;
  }

  // --- FUNÇÃO PRINCIPAL ---
  public async syncAllPendingChanges() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    console.log('🔄 Iniciando sincronização (Offline -> Online)...');

    try {
      await this.syncUsers();
      await this.syncPets();
      await this.processSyncLog();
      
      // Opcional: Baixar dados novos da nuvem após enviar os locais
      // await this.fetchAndSyncRemoteData();

      console.log('✅ Sincronização finalizada.');
    } catch (error) {
      console.error('❌ Erro durante o sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // 1. SYNC USUÁRIOS
  private async syncUsers() {
    const db = await DatabaseConnection.getConnection();
    const pendingUsers = await db.getAllAsync<any>("SELECT * FROM users WHERE sync_status != 'synced'");

    for (const userRow of pendingUsers) {
      const user = User.create(
        userRow.id,
        Name.create(userRow.name),
        Email.create(userRow.email),
        Password.create('cached_session'), // Senha placeholder (segurança)
        GeoCoordinates.create(userRow.latitude || 0, userRow.longitude || 0)
      );

      try {
        if (userRow.sync_status === 'pending_create') {
          // Se houver lógica de criar usuário offline:
          await this.userRepository.register(user);
        }
        // Se tivesse update de usuário:
        // else if (userRow.sync_status === 'pending_update') { ... }

        await db.runAsync("UPDATE user_profile SET sync_status = 'synced' WHERE id = ?", user.id);
      } catch (error) {
        console.error(`Falha ao sincronizar usuário ${user.id}:`, error);
      }
    }
  }

  // 2. SYNC PETS (COM UPLOAD DE FOTO)
  private async syncPets() {
    const db = await DatabaseConnection.getConnection();
    // Atenção: Certifique-se que sua tabela SQLite tem as colunas corretas
    const pendingPets = await db.getAllAsync<any>("SELECT * FROM pets WHERE sync_status != 'synced'");

    for (const petRow of pendingPets) {
      let photoUrl = petRow.photo_url; // Campo no banco

      try {
        // A. Upload da Imagem (se for caminho local file://)
        if (photoUrl && photoUrl.startsWith('file://')) {
          console.log(`📤 Fazendo upload da imagem local: ${photoUrl}`);
          const petUseCases = makePetPerfilUseCases();
          
          const uploadedPhotoUrl = await petUseCases.uploadFile.execute({
            imageAsset: photoUrl,
            bucket: 'pet-photos', // Nome do seu bucket no Supabase
            userId: petRow.owner_id,
          });
          
          console.log(`📸 Imagem enviada: ${uploadedPhotoUrl}`);
          photoUrl = uploadedPhotoUrl;
        }

        if (!photoUrl) {
            // Se foto for obrigatória, trate o erro aqui
            // throw new Error("URL da foto vazia");
        }

        // B. Recriar a Entidade usando RECONSTITUTE (pois já tem ID)
        // Mapeando colunas do SQLite (inglês) para a Entidade (português)
        const pet = PetPerfil.reconstitute(
          petRow.id,
          Name.create(petRow.name),
          Photo.create(photoUrl),
          petRow.category || 'Geral',   // Fallback se a coluna não existir no SQLite ainda
          petRow.description || petRow.descricao, // Tenta os dois nomes de coluna
          petRow.owner_id || petRow.donoId
        );

        // C. Salvar na Nuvem
        if (petRow.sync_status === 'pending_create') {
          await this.petRepository.save(pet);
        } else if (petRow.sync_status === 'pending_update') {
          await this.petRepository.update(pet);
        }

        // D. Atualizar Banco Local
        await db.runAsync(
          "UPDATE pets SET photo_url = ?, sync_status = 'synced' WHERE id = ?",
          photoUrl,
          petRow.id
        );

      } catch (error) {
        console.error(`Falha ao sincronizar Pet ${petRow.id}:`, error);
      }
    }
  }

  // 3. PROCESSAR DELETES
  private async processSyncLog() {
    const db = await DatabaseConnection.getConnection();
    const logEntries = await db.getAllAsync<any>("SELECT * FROM sync_log WHERE action = 'delete'");

    for (const logEntry of logEntries) {
      try {
        if (logEntry.entity_type === 'pet') {
          await this.petRepository.delete(logEntry.entity_id);
        } 
        // else if (logEntry.entity_type === 'user') ...

        await db.runAsync("DELETE FROM sync_log WHERE id = ?", logEntry.id);
      } catch (error) {
        console.error(`Falha ao processar sync_log id ${logEntry.id}:`, error);
      }
    }
  }

  // 4. DOWNLOAD DE DADOS (Online -> Offline)
  public async fetchAndSyncRemoteData() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    console.log('⬇️ Baixando dados remotos...');

    try {
      const remotePets = await this.petRepository.findAll();
      await this.updateLocalPets(remotePets);
      
      console.log('Dados remotos atualizados no cache.');
    } catch (error) {
      console.error('Erro ao baixar dados remotos:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  // Auxiliar para salvar no SQLite o que veio da nuvem
  private async updateLocalPets(remotePets: PetPerfil[]) {
    const db = await DatabaseConnection.getConnection();
    for (const pet of remotePets) {
      await db.runAsync(
        `INSERT OR REPLACE INTO pets (
            id, name, description, photo_url, category, owner_id, sync_status
         ) VALUES (?, ?, ?, ?, ?, ?, 'synced')`,
        pet.id,
        pet.name.value,
        pet.descricao, 
        pet.foto.url,
        pet.category,
        pet.donoId
      );
    }
  }
}