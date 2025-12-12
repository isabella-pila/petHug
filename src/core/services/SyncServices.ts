import NetInfo from '@react-native-community/netinfo';
import DatabaseConnection from '../infra/sqlite/connection';
import { SupabaseUserRepository } from '../infra/repositories/supabaseUserRepository';

import { IUserRepository } from '../domain/repositories/UserRepository';

import { User } from '../domain/entities/User';

import { Name } from '../domain/value-objects/Name';
import { Email } from '../domain/value-objects/Email';
import { Password } from '../domain/value-objects/Password';
import { GeoCoordinates } from '../domain/value-objects/GeoCoordinates';
import { Photo } from '../domain/value-objects/Photo';
import { PetPerfil } from '../domain/entities/PetPerfil';
import { IPetPerfilRepository } from '../domain/repositories/PetPerfilRepository';
import { makePetPerfilUseCases } from '../factories/MakePetPerfilRepository';
import { SupabasePetPerfilRepository } from '../infra/repositories/supabasePetRepository';


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

  private async syncAllPendingChanges() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    console.log('Starting sync...');

    try {
      await this.syncUsers();
      await this.processSyncLog();
      console.log('Sync finished successfully.');
    } catch (error) {
      console.error('Error during sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async syncUsers() {
    const db = await DatabaseConnection.getConnection();
    const pendingUsers = await db.getAllAsync<any>("SELECT * FROM users WHERE sync_status != 'synced'");

    for (const userRow of pendingUsers) {
      const user = User.create(
        userRow.id,
        Name.create(userRow.name),
        Email.create(userRow.email),
        Password.create(userRow.password_hash),
        GeoCoordinates.create(userRow.latitude, userRow.longitude)
      );

      try {
        if (userRow.sync_status === 'pending_create') {
          await this.userRepository.register(user);
        } else if (userRow.sync_status === 'pending_update') {
          await this.userRepository.update(user);
        }
        await db.runAsync("UPDATE users SET sync_status = 'synced' WHERE id = ?", user.id);
      } catch (error) {
        console.error(`Failed to sync user ${user.id}:`, error);
      }
    }
  }

  

  private async processSyncLog() {
    const db = await DatabaseConnection.getConnection();
    const logEntries = await db.getAllAsync<any>("SELECT * FROM sync_log WHERE action = 'delete'");

    for (const logEntry of logEntries) {
      try {
        if (logEntry.entity_type === 'user') {
          await this.userRepository.delete(logEntry.entity_id);
        } 
        await db.runAsync("DELETE FROM sync_log WHERE id = ?", logEntry.id);
      } catch (error) {
        console.error(`Failed to process sync_log entry ${logEntry.id}:`, error);
      }
    }
  }

  public async fetchAndSyncRemoteData() {
    if (this.isSyncing) return;
    this.isSyncing = true;
    console.log('Fetching remote data and syncing local DB...');

    try {
      const remoteUsers = await this.userRepository.findAll();
      await this.updateLocalUsers(remoteUsers);

  

      console.log('Remote data sync finished successfully.');
    } catch (error) {
      console.error('Error during remote data sync:', error);
    } finally {
      this.isSyncing = false;
    }
  }

  private async updateLocalUsers(remoteUsers: User[]) {
    const db = await DatabaseConnection.getConnection();
    for (const remoteUser of remoteUsers) {
      await db.runAsync(
        'INSERT OR REPLACE INTO users (id, name, email, password_hash, latitude, longitude, sync_status) VALUES (?, ?, ?, ?, ?, ?, ?)',
        remoteUser.id,
        remoteUser.name.value,
        remoteUser.email.value,
        remoteUser.password.value,
        remoteUser.location.latitude,
        remoteUser.location.longitude,
        'synced'
      );
    }
  }

  private async syncPets() {
    const db = await DatabaseConnection.getConnection();
    
    
    const pendingPets = await db.getAllAsync<any>("SELECT * FROM pets WHERE sync_status != 'synced'");

    if (pendingPets.length > 0) {
        console.log(` [Sync Pet] Encontrados ${pendingPets.length} pets para sincronizar.`);
    } else {
        return; // Nada para fazer
    }

  
    const { uploadFile } = makePetPerfilUseCases();

    for (const petRow of pendingPets) {
      let finalPhotoUrl = petRow.photo_url;

      try {
       
        if (finalPhotoUrl && finalPhotoUrl.startsWith('file://')) {
          console.log(`📤 [Sync Pet] Subindo foto local do pet: ${petRow.name}`);
          
         
          const imageAsset = { 
            uri: finalPhotoUrl, 
            type: 'image/jpeg', 
            fileName: `sync_${petRow.id}.jpg` 
          };

         
          const uploadedUrl = await uploadFile.execute({
            imageAsset: imageAsset as any, 
            bucket: 'pets_bucket', 
            userId: petRow.owner_id,
          });
          
          finalPhotoUrl = uploadedUrl;
          console.log(`📸 [Sync Pet] Foto enviada com sucesso: ${finalPhotoUrl}`);
        }

       
        const pet = PetPerfil.reconstitute(
          petRow.id,
          Name.create(petRow.name),
          Photo.create(finalPhotoUrl), 
          petRow.category || '',
          petRow.description || '',
          petRow.owner_id
        );

        if (petRow.sync_status === 'pending_create') {
          await this.petRepository.save(pet);
        } else if (petRow.sync_status === 'pending_update') {
          await this.petRepository.update(pet);
        }

        await db.runAsync(
          "UPDATE pets SET photo_url = ?, sync_status = 'synced' WHERE id = ?",
          finalPhotoUrl,
          pet.id
        );
        console.log(`✅ [Sync Pet] Pet ${pet.name.value} sincronizado com sucesso!`);

      } catch (error) {
        console.error(`❌ [Sync Pet] Falha ao sincronizar Pet ID ${petRow.id}:`, error);
       
      }
    }
  }

  
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
    console.log(`⬇️ [Sync Pet] ${remotePets.length} pets baixados e salvos no cache local.`);
  }
 
}