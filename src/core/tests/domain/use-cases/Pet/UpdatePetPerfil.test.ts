import { UpdatePetPerfil } from '../../../../domain/use-cases/petPerfil/UpadatePet';
import { RegisterPerfilPet } from '../../../../domain/use-cases/petPerfil/RegisterPet';
import { MockPetPerfilRepository } from '../../../../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';
import { User } from '../../../../domain/entities/User';
import { Name } from '../../../../domain/value-objects/Name';
import { Email } from '../../../../domain/value-objects/Email';
import { Password } from '../../../../domain/value-objects/Password';
import { GeoCoordinates } from '../../../../domain/value-objects/GeoCoordinates';

describe('UpdatePetPerfil Use Case', () => {
  let petProfileRepository: MockPetPerfilRepository;
  let userRepository: MockUserRepository;
  let registerPerfilPet: RegisterPerfilPet;
  let updatePetPerfil: UpdatePetPerfil;

  beforeEach(() => {
  
    petProfileRepository = MockPetPerfilRepository.getInstance();
    userRepository = MockUserRepository.getInstance();

    petProfileRepository.clear(); 
    userRepository.reset();
    registerPerfilPet = new RegisterPerfilPet(petProfileRepository, userRepository);
    updatePetPerfil = new UpdatePetPerfil(petProfileRepository);

    const mockUser = User.create(
      'user-1',
      Name.create('Dono'),
      Email.create('dono@email.com'),
      Password.create('Isa@12345'),
      GeoCoordinates.create(0, 0)
    );
    userRepository.save(mockUser);
  });

  it('should update a pet profile description', async () => {
    
    const pet = await registerPerfilPet.execute({
      nome: 'Bolinha',
      category: 'cachorro',
      
      photoUrl: 'https://example.com/bolinha.jpg',
       descricao: 'Cão amigável',
      donoId: 'user-1',
    });

  
    const updatedPet = await updatePetPerfil.execute({
      petId: pet.id,
      descricao: 'Cão muito brincalhão',
    });

    expect(updatedPet.descricao).toBe('Cão muito brincalhão');
    expect(updatedPet.name.value).toBe('Bolinha');
    expect(updatedPet.category).toBe('cachorro');
  });

  it('should throw an error if the pet profile is not found', async () => {
    // Arrange, Act & Assert
    await expect(
      updatePetPerfil.execute({
        petId: 'non-existent-id',
        nome: 'Fantasma',
      })
    ).rejects.toThrow('Perfil de pet não encontrado');
  });

  it('should not update fields if they are not provided', async () => {
    // Arrange
    const pet = await registerPerfilPet.execute({
      nome: 'Bolinha',
      descricao: 'Cão amigável',
      photoUrl: 'https://example.com/bolinha.jpg',
      category: 'cachorro', 
      donoId: 'user-1',
    });

   
    const updatedPet = await updatePetPerfil.execute({ petId: pet.id });

    
    expect(updatedPet.name.value).toBe('Bolinha');
    expect(updatedPet.descricao).toBe('Cão amigável');
    expect(updatedPet.category).toBe('cachorro');
  });

  
  it('should update only the category when it is provided', async () => {
    
    const pet = await registerPerfilPet.execute({
      nome: 'Bolinha',
      descricao: 'Cão amigável',
      photoUrl: 'https://example.com/bolinha.jpg',
      category: 'cachorro',
      donoId: 'user-1',
    });


    const updatedPet = await updatePetPerfil.execute({
      petId: pet.id,
      category: 'gato', 
    });


    expect(updatedPet.category).toBe('gato');
    expect(updatedPet.name.value).toBe('Bolinha'); 
  });
});