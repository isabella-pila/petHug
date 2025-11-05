import { PetPerfil } from '../../entities/PetPerfil';
import { IPetPerfilRepository } from '../../repositories/PetPerfilRepository';
import { Name } from '../../value-objects/Name';
import { Photo } from '../../value-objects/Photo';

export class UpdatePetPerfil {
  constructor(private readonly petProfileRepository: IPetPerfilRepository) {}

  async execute(params: {
    petId: string;
    nome?: string;
    category?: string;
    descricao?: string;
    photoUrl?: string;
  }): Promise<PetPerfil> {
    const { petId, nome, descricao, photoUrl, category } = params;
    
    const petProfile = await this.petProfileRepository.findById(petId);

    if (!petProfile) {
      throw new Error('Perfil de pet não encontrado');
    }

    const newNome = nome ? Name.create(nome) : petProfile.name;
    const newPhoto = photoUrl ? Photo.create(photoUrl) : petProfile.foto;
    const newDescricao = descricao ?? petProfile.descricao;
    const newCategory = category  ?? petProfile.category;

   
const updatedPetProfile = PetPerfil.reconstitute(
  petProfile.id,        
  newNome,
  newPhoto,
  newCategory,
  newDescricao,
  petProfile.donoId,
);

    await this.petProfileRepository.update(updatedPetProfile);

    return updatedPetProfile;
  }
}