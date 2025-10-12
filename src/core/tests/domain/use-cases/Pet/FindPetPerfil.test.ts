import { FindPetPerfil } from '../../../../domain/use-cases/petPerfil/FindPet';
import { RegisterPerfilPet } from '../../../../domain/use-cases/petPerfil/RegisterPet';
import { MockPetPerfilRepository } from '../../../../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';
import { User } from '../../../../domain/entities/User';
import { Email } from '../../../../domain/value-objects/Email';
import { Name } from '../../../../domain/value-objects/Name'; 
import { Password } from '../../../../domain/value-objects/Password';
import { GeoCoordinates } from '../../../../domain/value-objects/GeoCoordinates'; 

describe('FindPetPerfil Use Case', () => {
  let petProfileRepository: MockPetPerfilRepository;
  let userRepository: MockUserRepository;
  let registerPerfilPet: RegisterPerfilPet;
  let findPetPerfil: FindPetPerfil;

  beforeEach(() => {
    petProfileRepository =  MockPetPerfilRepository.getInstance();
    userRepository =  MockUserRepository.getInstance();
    registerPerfilPet = new RegisterPerfilPet(petProfileRepository, userRepository);
    findPetPerfil = new FindPetPerfil(petProfileRepository);
  });

  it('should find a pet profile by its id', async () => {

    const user = User.create(
      'user-456',
      Name.create('Maria Souza'),
      Email.create('maria@email.com'),
      Password.create('Senha@Forte123'),
      GeoCoordinates.create(-21.56, -45.44) 
    );
    await userRepository.save(user);

    const createdPetProfile = await registerPerfilPet.execute({
      nome: 'Fifi',
      descricao: 'Uma gatinha elegante',
      photoUrl: 'https://example.com/fifi.jpg',
      category: 'gato',
      donoId: 'user-456',
    });

  
    const foundPetProfile = await findPetPerfil.execute({ id: createdPetProfile.id });

    expect(foundPetProfile).toBe(createdPetProfile);
  });

  it('should return null if the pet profile is not found', async () => {

    const foundPetProfile = await findPetPerfil.execute({ id: 'non-existent-id' });

    expect(foundPetProfile).toBeNull();
  });
});