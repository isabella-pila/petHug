import { PetPerfil } from '../../entities/PetPerfil';
import { IPetPerfilRepository } from '../../repositories/PetPerfilRepository';

export class FindAllPets {
  constructor(private readonly petProfileRepository: IPetPerfilRepository) {}

  async execute(): Promise<PetPerfil[]> {

    return this.petProfileRepository.findAll();
  }
}