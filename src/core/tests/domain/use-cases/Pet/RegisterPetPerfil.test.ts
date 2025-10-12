import { RegisterPerfilPet } from '../../../../domain/use-cases/petPerfil/RegisterPet';
import { MockPetPerfilRepository } from '../../../../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';
import { User } from '../../../../domain/entities/User';
import { Name } from '../../../../domain/value-objects/Name';
import { Email } from '../../../../domain/value-objects/Email';
import { Password } from '../../../../domain/value-objects/Password';
import { GeoCoordinates } from '../../../../domain/value-objects/GeoCoordinates';

describe('RegisterPerfilPet Use Case', () => {
  let petProfileRepository: MockPetPerfilRepository;
  let userRepository: MockUserRepository;
  let registerPerfilPet: RegisterPerfilPet;
  let validUser: User;

  
  beforeEach(async () => {
   
    petProfileRepository = MockPetPerfilRepository.getInstance();
    userRepository = MockUserRepository.getInstance();


    petProfileRepository.clear();
    userRepository.reset();


    registerPerfilPet = new RegisterPerfilPet(petProfileRepository, userRepository);

  
    validUser = User.create(
      'user-valido-1',
      Name.create('Dono Válido'),
      Email.create('dono@teste.com'),
      Password.create('SenhaValida@123'),
      GeoCoordinates.create(-21.79, -45.44)
    );
    await userRepository.save(validUser);
  });

  
  it('should register a new pet profile for a valid user', async () => {

    const petData = {
      nome: 'Fifi',
      descricao: 'Uma pet muito amigável',
      category: 'cachorro',
      donoId: validUser.id, 
      photoUrl: 'https://example.com/fifi.jpg',
    };

    // Act: Executa o caso de uso
    const petProfile = await registerPerfilPet.execute(petData);

   expect(petProfile.id).toEqual(expect.any(String));
    expect(petProfile).toBeDefined();
    expect(petProfile.name.value).toBe('Fifi');
    expect(petProfile.donoId).toBe(validUser.id);
    expect(petProfile.category).toBe('cachorro');

    
    const foundPet = await petProfileRepository.findById(petProfile.id);
    expect(foundPet).toEqual(petProfile);
  });

 
  it('should throw an error if the owner (user) is not found', async () => {
    
    const petData = {
      nome: 'Fantasma',
      descricao: 'Um pet sem dono',
      category: 'outros',
      donoId: 'id-de-dono-invalido',
      photoUrl: 'https://example.com/fantasma.jpg',
    };

    
    await expect(
      registerPerfilPet.execute(petData)
    ).rejects.toThrow('Usuário (dono) não encontrado');
  });
});