import NetInfo from '@react-native-community/netinfo';
import { IUserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { SupabaseUserRepository } from './supabaseUserRepository'; // Ajuste o caminho se necessário
import { SQLiteUserRepository } from '../sqlite/SQLiteUserRepository'; // Ajuste o caminho se necessário

export class HybridUserRepository implements IUserRepository {
  private static instance: HybridUserRepository;
  private onlineRepo: IUserRepository;
  private offlineRepo: IUserRepository; // Assumindo que o SQLiteUserRepository implementa a mesma interface

  private constructor() {
    this.onlineRepo = SupabaseUserRepository.getInstance();
    this.offlineRepo = SQLiteUserRepository.getInstance();
  }

  public static getInstance(): HybridUserRepository {
    if (!HybridUserRepository.instance) {
      HybridUserRepository.instance = new HybridUserRepository();
    }
    return HybridUserRepository.instance;
  }

  private async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected ?? false;
  }

  // --- REGISTER ---
  async register(user: User): Promise<User> {
    if (await this.isOnline()) {
      try {
        // Tenta registrar na nuvem
        const remoteUser = await this.onlineRepo.register(user);
        
        // Se der certo, tenta salvar uma cópia local (Cache)
        try {
            await this.offlineRepo.register(remoteUser);
        } catch (localError) {
            // Se o usuário já existir localmente, ignoramos o erro
            // ou usamos um método de 'save/upsert' se existir no futuro
            console.log('Usuário já existe localmente ou erro de cache:', localError);
        }
        
        return remoteUser;
      } catch (error) {
        console.warn('Registro online falhou, tentando offline.', error);
        // Fallback: Salva localmente para subir depois
        return this.offlineRepo.register(user);
      }
    }
    // Sem internet: Salva direto no offline
    return this.offlineRepo.register(user);
  }

  // --- AUTHENTICATE ---
  async authenticate(email: string, password: string): Promise<User> {
    if (await this.isOnline()) {
      try {
        const user = await this.onlineRepo.authenticate(email, password);
        
        // REMOVIDO: await this.offlineRepo.update(user);
        // MOTIVO: Seu repositório não tem update.
        // Opcional: Você pode tentar chamar .register(user) aqui dentro de um try/catch
        // para garantir que os dados mais recentes da nuvem fiquem salvos no celular.
        try {
             await this.offlineRepo.register(user); 
        } catch (e) {
             // Ignora erro se já existir no banco local
        }

        return user;
      } catch (error) {
        console.warn('Autenticação online falhou, tentando offline.', error);
        return this.offlineRepo.authenticate(email, password);
      }
    }
    return this.offlineRepo.authenticate(email, password);
  }

  // --- FIND BY EMAIL ---
  async findByEmail(email: string): Promise<User | null> {
    if (await this.isOnline()) {
      try {
        const user = await this.onlineRepo.findByEmail(email);
        if (user) return user;
      } catch (e) {
        // Se der erro na rede, tenta local
      }
    }
    return this.offlineRepo.findByEmail(email);
  }

  // --- FIND BY ID ---
  async findById(id: string): Promise<User | null> {
    if (await this.isOnline()) {
        try {
            const user = await this.onlineRepo.findById(id);
            if (user) return user;
        } catch (e) {
            // Se der erro na rede, tenta local
        }
    }
    return this.offlineRepo.findById(id);
  }

  // REMOVIDO: async update(user: User) ...
  // REMOVIDO: async delete(id: string) ... (Se sua interface não pede, não precisa)
  // REMOVIDO: async findAll() ...
}