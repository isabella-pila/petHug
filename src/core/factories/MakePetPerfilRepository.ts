// --- Repositórios ---
import { IPetPerfilRepository } from '../domain/repositories/PetPerfilRepository';
import { IUserRepository } from '../domain/repositories/UserRepository';
import { MockPetPerfilRepository } from '../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../infra/repositories/MockUserRepository';

// --- Use Cases ---
import { RegisterPerfilPet } from '../domain/use-cases/petPerfil/RegisterPet';
import { UpdatePetPerfil } from '../domain/use-cases/petPerfil/UpadatePet';
import { DeletePetPerfil } from '../domain/use-cases/petPerfil/DeletePet';
import { FindPetPerfil } from '../domain/use-cases/petPerfil/FindPet';
import { FindPetsByDonoId } from '../domain/use-cases/petPerfil/FindPetsByDonoId';
import { FindAllPets } from '../domain/use-cases/petPerfil/FindAllPets';

export function makePetPerfilUseCases() {
 
  const petProfileRepository: IPetPerfilRepository = MockPetPerfilRepository.getInstance();
  const userRepository: IUserRepository = MockUserRepository.getInstance();

  const registerPerfilPet = new RegisterPerfilPet(
    petProfileRepository,
    userRepository
  );
  const updatePerfilPet = new UpdatePetPerfil(petProfileRepository);
  const deletePerfilPet = new DeletePetPerfil(petProfileRepository);
  const findPerfilPet = new FindPetPerfil(petProfileRepository);
  const findByDonoId = new FindPetsByDonoId(petProfileRepository);
  const findAllPets = new FindAllPets(petProfileRepository);

  return {
    registerPerfilPet,
    updatePerfilPet,
    deletePerfilPet,
    findPerfilPet,
    findByDonoId,
    findAllPets,
  };
}