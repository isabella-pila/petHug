import { IPetPerfilRepository } from '../../repositories/PetPerfilRepository';

export class DeletePetPerfil {
  constructor(private readonly PetPerfilRepository: IPetPerfilRepository) {}

  async execute(params: { id: string }): Promise<void> {
    const { id } = params;

    const record = await this.PetPerfilRepository.findById(id);

    if (!record) {
      throw new Error('Pet not found');
    }

    await this.PetPerfilRepository.delete(id);
  }
}