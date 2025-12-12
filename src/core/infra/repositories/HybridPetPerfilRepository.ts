import NetInfo from '@react-native-community/netinfo';
import { IPetPerfilRepository } from '../../domain/repositories/PetPerfilRepository';
import { PetPerfil } from '../../domain/entities/PetPerfil';
import { SupabasePetPerfilRepository } from './supabasePetRepository'; 
import { SQLitePetPerfilRepository } from '../sqlite/SQLitePetRepository'; 

export class HybridPetPerfilRepository implements IPetPerfilRepository {
  private static instance: HybridPetPerfilRepository;
  private onlineRepo: IPetPerfilRepository;
  private offlineRepo: IPetPerfilRepository; // Aqui usamos o tipo específico se precisar de métodos extras, mas a interface basta

  private constructor() {
    this.onlineRepo = SupabasePetPerfilRepository.getInstance();
    this.offlineRepo = SQLitePetPerfilRepository.getInstance();
  }

  public static getInstance(): HybridPetPerfilRepository {
    if (!HybridPetPerfilRepository.instance) {
      HybridPetPerfilRepository.instance = new HybridPetPerfilRepository();
    }
    return HybridPetPerfilRepository.instance;
  }

  private async isOnline(): Promise<boolean> {
    const state = await NetInfo.fetch();
    return state.isConnected && state.isInternetReachable ? true : false;
  }


  async save(pet: PetPerfil): Promise<void> {
    if (await this.isOnline()) {
      try {
        await this.onlineRepo.save(pet);
       
        await this.offlineRepo.save(pet); 
      } catch (error) {
        console.warn('Save online falhou, salvando offline.', error);
        await this.offlineRepo.save(pet);
      }
    } else {
      await this.offlineRepo.save(pet);
    }
  }

  // --- FIND ALL (AQUI ESTAVA O PROBLEMA) ---
  async findAll(): Promise<PetPerfil[]> {
    if (await this.isOnline()) {
      try {
        console.log("☁️ Buscando pets online...");
        const pets = await this.onlineRepo.findAll();
        
        
        await this.cachePetsLocally(pets);
        
        return pets;
      } catch (e) {
        console.warn("Erro ao buscar online, tentando cache...", e);
      }
    }
    console.log("💾 Buscando pets offline...");
    return this.offlineRepo.findAll();
  }

 
  async findByDonoId(donoId: string): Promise<PetPerfil[]> {
    if (await this.isOnline()) {
      try {
        console.log(`☁️ Buscando pets do dono ${donoId} online...`);
        const pets = await this.onlineRepo.findByDonoId(donoId);
        
        
        await this.cachePetsLocally(pets);

        return pets;
      } catch (e) {
        console.warn("Erro ao buscar por dono online, tentando cache...", e);
      }
    }
    console.log("💾 Buscando pets do dono offline...");
    return this.offlineRepo.findByDonoId(donoId);
  }


  async findById(id: string): Promise<PetPerfil | null> {
    if (await this.isOnline()) {
      try {
        const pet = await this.onlineRepo.findById(id);
        if (pet) {
            
            await this.cachePetsLocally([pet]); 
            return pet;
        }
      } catch (e) { }
    }
    return this.offlineRepo.findById(id);
  }

  
  async update(pet: PetPerfil): Promise<void> {
    // Atualiza local primeiro para feedback rápido
    await this.offlineRepo.update(pet);

    if (await this.isOnline()) {
      try {
        await this.onlineRepo.update(pet);
       
      } catch (error) {
        
      }
    }
  }

  // --- DELETE ---
  async delete(id: string): Promise<void> {
    if (await this.isOnline()) {
      try {
        await this.onlineRepo.delete(id);
      } catch (error) {
       
      }
    }
    await this.offlineRepo.delete(id);
  }

  private async cachePetsLocally(pets: PetPerfil[]) {
    try {

        for (const pet of pets) {
            await this.offlineRepo.save(pet);
        }
        console.log(`✅ ${pets.length} pets atualizados no cache local.`);
    } catch (error) {
        console.error("Erro ao cachear pets:", error);
    }
  }
}