// --- Repositórios ---
import { IPetPerfilRepository } from '../domain/repositories/PetPerfilRepository';
import { IUserRepository } from '../domain/repositories/UserRepository';

// Importe o Híbrido aqui
import { HybridPetPerfilRepository } from '../infra/repositories/HybridPetPerfilRepository'; 
import { HybridUserRepository } from '../infra/repositories/HybridUserRepository'; // Assumindo que você tem o de user também

// --- Use Cases ---
import { RegisterPerfilPet } from '../domain/use-cases/petPerfil/RegisterPet';
import { UpdatePetPerfil } from '../domain/use-cases/petPerfil/UpadatePet';
import { DeletePetPerfil } from '../domain/use-cases/petPerfil/DeletePet';
import { FindPetPerfil } from '../domain/use-cases/petPerfil/FindPet';
import { FindPetsByDonoId } from '../domain/use-cases/petPerfil/FindPetsByDonoId';
import { FindAllPets } from '../domain/use-cases/petPerfil/FindAllPets';

import { UploadFileUseCase } from "../domain/use-cases/UploadFile";
import { DeleteFileUseCase } from "../domain/use-cases/DeleteFile";
import { SupabaseStorageService } from "../infra/supabase/storage/storageService";

export function makePetPerfilUseCases() {
 
  // ✨ MUDANÇA: Usando o Repositório Híbrido para Pets
  const petProfileRepository: IPetPerfilRepository = HybridPetPerfilRepository.getInstance();
   
  // ✨ MUDANÇA: Usando o Repositório Híbrido para Users (Recomendado)
  const userRepository: IUserRepository = HybridUserRepository.getInstance();

  const registerPerfilPet = new RegisterPerfilPet(
    petProfileRepository,
    userRepository
  );
  
  const updatePerfilPet = new UpdatePetPerfil(petProfileRepository);
  const deletePerfilPet = new DeletePetPerfil(petProfileRepository);
  const findPerfilPet = new FindPetPerfil(petProfileRepository);
  const findByDonoId = new FindPetsByDonoId(petProfileRepository);
  const findAllPets = new FindAllPets(petProfileRepository);

  const supabaseStorageRepository = new SupabaseStorageService();
  const uploadFile = new UploadFileUseCase(supabaseStorageRepository);
  const deleteFile = new DeleteFileUseCase(supabaseStorageRepository);

  return {
    registerPerfilPet,
    updatePerfilPet,
    deletePerfilPet,
    findPerfilPet,
    findByDonoId,
    findAllPets,
    uploadFile,
    deleteFile
  };
}