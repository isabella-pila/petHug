import { PetPerfil } from '../../entities/PetPerfil';
import { IPetPerfilRepository } from '../../repositories/PetPerfilRepository';

export class FindPetPerfil {
  constructor(private readonly PetperfilRepository: IPetPerfilRepository ) {}

  async execute(params: { id: string }): Promise<PetPerfil | null> {
    return this.PetperfilRepository.findById(params.id);
  }
}