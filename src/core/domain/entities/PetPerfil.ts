import { Name } from '../value-objects/Name';
import { Photo } from '../value-objects/Photo';
import { generateUniqueId } from '../../generate-id';



export class PetPerfil {
  private constructor(
    readonly id: string,
    readonly name: Name,
    readonly foto: Photo,
    readonly category: string,
    readonly descricao: string,
    readonly donoId: string,
  ) {}

  static create(
    name: Name,
    foto: Photo,
    category: string,
    descricao: string,
    donoId: string,
    
  ): PetPerfil {
    const id = generateUniqueId();
    return new PetPerfil(id, name, foto, category, descricao, donoId);
  }

static reconstitute(
 id: string,
 name: Name,
 foto: Photo,
category: string,
 descricao: string,
 donoId: string,
 ): PetPerfil {

return new PetPerfil(id, name, foto, category, descricao, donoId);
 }
}