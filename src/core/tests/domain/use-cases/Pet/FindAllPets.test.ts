import { FindAllPets } from '../../../../domain/use-cases/petPerfil/FindAllPets';
import { RegisterPerfilPet } from '../../../../domain/use-cases/petPerfil/RegisterPet';
import { MockPetPerfilRepository } from '../../../../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';
import { User } from '../../../../domain/entities/User';
import { Name } from '../../../../domain/value-objects/Name';
import { Email } from '../../../../domain/value-objects/Email';
import { Password } from '../../../../domain/value-objects/Password';
import { GeoCoordinates } from '../../../../domain/value-objects/GeoCoordinates';

describe('FindAllPets Use Case', () => {
  let petProfileRepository: MockPetPerfilRepository;
  let userRepository: MockUserRepository;
  let registerPerfilPet: RegisterPerfilPet; 
  let findAllPets: FindAllPets; 

  beforeEach(() => {
    petProfileRepository = MockPetPerfilRepository.getInstance();
    userRepository = MockUserRepository.getInstance();


    petProfileRepository.clear();
    userRepository.reset();

    // Instancia os casos de uso
    findAllPets = new FindAllPets(petProfileRepository);
    registerPerfilPet = new RegisterPerfilPet(petProfileRepository, userRepository);

    // Cria um usuário mock, necessário para poder registrar pets
    const mockUser = User.create(
      'user-1',
      Name.create('Dono Padrão'),
      Email.create('dono@email.com'),
      Password.create('Senha@123'),
      GeoCoordinates.create(0, 0)
    );
    userRepository.save(mockUser);
  });

  // Teste 1: O cenário feliz, quando existem pets
  it('should return all registered pet profiles', async () => {
    // Arrange: Prepara o cenário criando dois pets
    await registerPerfilPet.execute({
      nome: 'Fido',
      descricao: 'Um cão leal',
      photoUrl: 'http://example.com/fido.png',
      category: 'cachorro',
      donoId: 'user-1',
    });
    await registerPerfilPet.execute({
      nome: 'Whiskers',
      descricao: 'Um gato curioso',
      photoUrl: 'http://example.com/whiskers.png',
      category: 'gato',
      donoId: 'user-1',
    });

    // Act: Executa a ação que queremos testar
    const allPets = await findAllPets.execute();

    // Assert: Verifica se o resultado é o esperado
    expect(allPets).toHaveLength(2); // Esperamos encontrar 2 pets
    expect(allPets[0].name.value).toBe('Fido');
    expect(allPets[1].name.value).toBe('Whiskers');
  });

  // Teste 2: O cenário de "estado vazio"
  it('should return an empty array when no pets are registered', async () => {
    // Arrange: Não fazemos nada, pois o `beforeEach` já limpou o repositório

    // Act: Executa a ação
    const allPets = await findAllPets.execute();

    // Assert: Verifica o resultado
    expect(allPets).toBeInstanceOf(Array); // Confirma que é um array
    expect(allPets).toHaveLength(0);      // Confirma que o array está vazio
  });
});