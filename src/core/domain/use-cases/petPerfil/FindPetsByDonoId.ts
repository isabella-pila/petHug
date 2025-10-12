import { PetPerfil } from '../../entities/PetPerfil';
import { IPetPerfilRepository } from '../../repositories/PetPerfilRepository';


interface Input {
  donoId: string;
}

export class FindPetsByDonoId {
  constructor(private readonly petProfileRepository: IPetPerfilRepository) {}

  
  async execute(params: Input): Promise<PetPerfil[]> {
    const { donoId } = params;

  
    const pets = await this.petProfileRepository.findByDonoId(donoId);

    return pets;
  }
}