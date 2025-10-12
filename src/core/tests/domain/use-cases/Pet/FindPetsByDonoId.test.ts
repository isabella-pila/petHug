import { FindPetsByDonoId } from '../../../../domain/use-cases/petPerfil/FindPetsByDonoId';
import { RegisterPerfilPet } from '../../../../domain/use-cases/petPerfil/RegisterPet';
import { MockPetPerfilRepository } from '../../../../infra/repositories/MockPetPerfilRepository';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';
import { User } from '../../../../domain/entities/User';
import { Name } from '../../../../domain/value-objects/Name';
import { Email } from '../../../../domain/value-objects/Email';
import { Password } from '../../../../domain/value-objects/Password';
import { GeoCoordinates } from '../../../../domain/value-objects/GeoCoordinates';

describe('FindPetsByDonoId Use Case', () => {
  let petProfileRepository: MockPetPerfilRepository;
  let userRepository: MockUserRepository;
  let registerPerfilPet: RegisterPerfilPet; 
  let findPetsByDonoId: FindPetsByDonoId;  

  beforeEach(() => {
  
    petProfileRepository = MockPetPerfilRepository.getInstance();
    userRepository = MockUserRepository.getInstance();

   
    petProfileRepository.clear();
    userRepository.reset();

    // Instancia os casos de uso
    findPetsByDonoId = new FindPetsByDonoId(petProfileRepository);
    registerPerfilPet = new RegisterPerfilPet(petProfileRepository, userRepository);
  });

 
  it('should return only the pets belonging to the specified owner', async () => {
   
    const userOne = User.create('user-1', Name.create('Dono Um'), Email.create('dono1@email.com'), Password.create('Senha1234!'), GeoCoordinates.create(0,0));
    const userTwo = User.create('user-2', Name.create('Dono Dois'), Email.create('dono2@email.com'), Password.create('Senha1234!'), GeoCoordinates.create(0,0));
    await userRepository.save(userOne);
    await userRepository.save(userTwo);

    await registerPerfilPet.execute({ nome: 'Rex', descricao: 'Cão do Dono Um', photoUrl: 'http://exemplo.com', category: 'cachorro', donoId: 'user-1' });
    await registerPerfilPet.execute({ nome: 'Frajola', descricao: 'Gato do Dono Um', photoUrl: 'http://exemplo.com', category: 'gato', donoId: 'user-1' });


    await registerPerfilPet.execute({ nome: 'Piu-piu', descricao: 'Pássaro do Dono Dois', photoUrl: 'http://exemplo.com', category: 'outros', donoId: 'user-2' });
    const petsOfUserOne = await findPetsByDonoId.execute({ donoId: 'user-1' });


    expect(petsOfUserOne).toHaveLength(2); 
    expect(petsOfUserOne[0].name.value).toBe('Rex');
    expect(petsOfUserOne[1].name.value).toBe('Frajola');

    expect(petsOfUserOne.some(pet => pet.name.value === 'Piu-piu')).toBe(false);
  });

  
  it('should return an empty array if the owner has no pets', async () => {
  
    const userWithoutPets = User.create('user-3', Name.create('Sem Pets'), Email.create('sempets@email.com'), Password.create('Senha1234!'), GeoCoordinates.create(0,0));
    await userRepository.save(userWithoutPets);
    
    const pets = await findPetsByDonoId.execute({ donoId: 'user-3' });

  
    expect(pets).toBeInstanceOf(Array);
    expect(pets).toHaveLength(0);
  });

  it('should return an empty array for a non-existent owner ID', async () => {
   
    const pets = await findPetsByDonoId.execute({ donoId: 'non-existent-user' });

    
    expect(pets).toHaveLength(0);
  });
});