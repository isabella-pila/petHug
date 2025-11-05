// --- Repositórios ---
import { IPetPerfilRepository } from '../domain/repositories/PetPerfilRepository';
import { IUserRepository } from '../domain/repositories/UserRepository';
import { SupabaseUserRepository } from '../infra/repositories/supabaseUserRepository'
import { MockPetPerfilRepository } from '../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../infra/repositories/MockUserRepository';
// --- Use Cases ---
import { RegisterPerfilPet } from '../domain/use-cases/petPerfil/RegisterPet';
import { UpdatePetPerfil } from '../domain/use-cases/petPerfil/UpadatePet';
import { DeletePetPerfil } from '../domain/use-cases/petPerfil/DeletePet';
import { FindPetPerfil } from '../domain/use-cases/petPerfil/FindPet';
import { FindPetsByDonoId } from '../domain/use-cases/petPerfil/FindPetsByDonoId';
import { FindAllPets } from '../domain/use-cases/petPerfil/FindAllPets';
import { SupabasePetPerfilRepository } from '../infra/repositories/supabasePetRepository';

import {UploadFileUseCase} from "../domain/use-cases/UploadFile"
import {DeleteFileUseCase} from "../domain/use-cases/DeleteFile"
import {SupabaseStorageService} from "../infra/supabase/storage/storageService"

export function makePetPerfilUseCases() {
 
  const petProfileRepository: IPetPerfilRepository = SupabasePetPerfilRepository.getInstance();
   
const userRepository: IUserRepository = SupabaseUserRepository.getInstance();



  const registerPerfilPet = new RegisterPerfilPet(
    petProfileRepository,
    userRepository
  );
  
  const updatePerfilPet = new UpdatePetPerfil(petProfileRepository);
  const deletePerfilPet = new DeletePetPerfil(petProfileRepository);
  const findPerfilPet = new FindPetPerfil(petProfileRepository);
  const findByDonoId = new FindPetsByDonoId(petProfileRepository);
  const findAllPets = new FindAllPets(petProfileRepository);

  const supabaseStorageRepository = new SupabaseStorageService
  const uploadFile = new UploadFileUseCase(supabaseStorageRepository)
  const deleteFile = new DeleteFileUseCase(supabaseStorageRepository)


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