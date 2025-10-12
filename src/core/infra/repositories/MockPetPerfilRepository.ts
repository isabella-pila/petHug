import { PetPerfil } from '../../domain/entities/PetPerfil';
import { IPetPerfilRepository } from '../../domain/repositories/PetPerfilRepository';

export class MockPetPerfilRepository implements IPetPerfilRepository {
  
  private static instance: MockPetPerfilRepository;

  private petProfiles: PetPerfil[] = [];

  
  private constructor() { }

  public static getInstance(): MockPetPerfilRepository {
    if (!MockPetPerfilRepository.instance) {
      MockPetPerfilRepository.instance = new MockPetPerfilRepository();
    }
    return MockPetPerfilRepository.instance;
  }



  async findAll(): Promise<PetPerfil[]> {
    return this.petProfiles;
  }

  async save(petProfile: PetPerfil): Promise<void> {
    this.petProfiles.push(petProfile);
  }

  async findById(id: string): Promise<PetPerfil | null> {
    return this.petProfiles.find(profile => profile.id === id) || null;
  }

  async findByDonoId(donoId: string): Promise<PetPerfil[]> {
    return this.petProfiles.filter(profile => profile.donoId === donoId);
  }

  async update(petProfile: PetPerfil): Promise<void> {
    const profileIndex = this.petProfiles.findIndex(p => p.id === petProfile.id);
    if (profileIndex !== -1) {
      this.petProfiles[profileIndex] = petProfile;
    }
  }

  async delete(id: string): Promise<void> {
    this.petProfiles = this.petProfiles.filter(profile => profile.id !== id);
  }
  

  clear(): void {
    this.petProfiles = [];
  }
}