
import { PetPerfil } from '../../entities/PetPerfil';
import { IPetPerfilRepository } from '../../repositories/PetPerfilRepository';
import { Name } from '../../value-objects/Name';
import { Photo } from '../../value-objects/Photo';
import { IUserRepository } from '../../repositories/UserRepository';


class UserNotFoundError extends Error {
  constructor() {
    super('Usuário (dono) não encontrado.');
    this.name = 'UserNotFoundError';
  }
}

export class RegisterPerfilPet {
  constructor(

    private readonly petProfileRepository: IPetPerfilRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(params: {
    nome: string;
    descricao: string;
  
    photoUrl: string;
    category: string;
    donoId: string;

  }): Promise<PetPerfil> {
    const user = await this.userRepository.findById(params.donoId);
    if (!user) {
      
      throw new UserNotFoundError();
    }

    const { nome, descricao, photoUrl, category, donoId } = params;
    
    const petProfile = PetPerfil.create(
           
      Name.create(nome), 
      
    Photo.create(photoUrl),  
      category,
      descricao,             
      donoId,                 
    );

    await this.petProfileRepository.save(petProfile);

    return petProfile;
  }
}