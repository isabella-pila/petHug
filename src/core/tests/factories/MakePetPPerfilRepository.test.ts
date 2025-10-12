import { makePetPerfilUseCases } from '../../factories/MakePetPerfilRepository';

describe('makeVinylRecordUseCases', () => {
  it('should create and return all vinyl record use cases', () => {
    const useCases = makePetPerfilUseCases();
    expect(useCases.registerPerfilPet).toBeDefined();
    expect(useCases.updatePerfilPet).toBeDefined();
    expect(useCases.deletePerfilPet).toBeDefined();
    expect(useCases.findPerfilPet).toBeDefined();
  });
});