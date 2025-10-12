import { DeletePetPerfil } from '../../../../domain/use-cases/petPerfil/DeletePet';
import { RegisterPerfilPet } from '../../../../domain/use-cases/petPerfil/RegisterPet';
import { MockPetPerfilRepository } from '../../../../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';
import { User } from '../../../../domain/entities/User';
import { Name } from '../../../../domain/value-objects/Name';
import { Email } from '../../../../domain/value-objects/Email';
import { Password } from '../../../../domain/value-objects/Password';
import { GeoCoordinates } from '../../../../domain/value-objects/GeoCoordinates';

describe('DeletePetPerfil Use Case', () => {
  let petProfileRepository: MockPetPerfilRepository;
  let userRepository: MockUserRepository;
  let registerPerfilPet: RegisterPerfilPet;
  let deletePetPerfil: DeletePetPerfil;

  beforeEach(async () => {
    
    petProfileRepository = MockPetPerfilRepository.getInstance();
    userRepository = MockUserRepository.getInstance();

    
    petProfileRepository.clear();
    userRepository.reset();

   
    deletePetPerfil = new DeletePetPerfil(petProfileRepository);
    registerPerfilPet = new RegisterPerfilPet(petProfileRepository, userRepository);

   
    const mockUser = User.create('user-1', 
      Name.create('Dono'), 
      Email.create('dono@email.com'), 
      Password.create('SenhaValida@123'),
       GeoCoordinates.create(0, 0));
    await userRepository.save(mockUser);
  });


  it('should successfully delete an existing pet profile', async () => {
 
    const pet = await registerPerfilPet.execute({
      nome: 'Rex',
      descricao: 'Cachorro amigável',
      photoUrl: 'https://example.com/rex.jpg',
      category: 'cachorro',
      donoId: 'user-1',
    });

    
    const petBeforeDelete = await petProfileRepository.findById(pet.id);
    expect(petBeforeDelete).not.toBeNull();

   
    await deletePetPerfil.execute({ id: pet.id });

    
    const petAfterDelete = await petProfileRepository.findById(pet.id);
    expect(petAfterDelete).toBeNull();
  });

  it('should throw an error when trying to delete a non-existent pet', async () => {
    await expect(
      deletePetPerfil.execute({ id: 'id-que-nao-existe' })
    ).rejects.toThrow('Pet not found');
  });
});