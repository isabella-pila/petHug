import { Photo } from '../../domain/value-objects/Photo';
import { Name } from '../../domain/value-objects/Name';
import { MockPetPerfilRepository } from '../../infra/repositories/MockPetPerfilRepository';
import { PetPerfil } from '../../domain/entities/PetPerfil';
import { IPetPerfilRepository } from '../../domain/repositories/PetPerfilRepository';

describe('MockPetPerfilRepository', () => {
  it('should not throw when updating a non-existent vinyl record', async () => {
    const petPerfilRepository: IPetPerfilRepository =MockPetPerfilRepository.getInstance();
    const petPerfil = PetPerfil.create(
     
      Name.create('Symon'),
      Photo.create('https://example.com/abbey-road.jpg'),
      'Descricao do pet',
      'gato',
      '1',
      
    );

    await expect(petPerfilRepository.update(petPerfil)).resolves.not.toThrow();
  });
});