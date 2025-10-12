import { PetPerfil } from '../entities/PetPerfil';

export interface IPetPerfilRepository {
    save(petPerfil: PetPerfil): Promise<void>;
    findById(id: string): Promise<PetPerfil | null>;
    findByDonoId(donoId: string): Promise<PetPerfil[]>;
    update(petPerfil: PetPerfil): Promise<void>;
    delete(id: string): Promise<void>;
    findAll(): Promise<PetPerfil[]>;
}
