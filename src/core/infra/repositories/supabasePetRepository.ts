import { supabase } from '../supabase/client/supabaseClient'; // Verifique se este caminho está correto
import { IPetPerfilRepository } from '../../domain/repositories/PetPerfilRepository';
import { PetPerfil } from '../../domain/entities/PetPerfil';
import { Name } from '../../domain/value-objects/Name';
import { Photo } from '../../domain/value-objects/Photo';

export class SupabasePetPerfilRepository implements IPetPerfilRepository {
  private static instance: SupabasePetPerfilRepository;

  private constructor() {}

  public static getInstance(): SupabasePetPerfilRepository {
    if (!SupabasePetPerfilRepository.instance) {
      SupabasePetPerfilRepository.instance = new SupabasePetPerfilRepository();
    }
    return SupabasePetPerfilRepository.instance;
  }


  async save(pet: PetPerfil): Promise<void> {
    const { error } = await supabase.from('pet_perfis').insert({
      id: pet.id, 
      name: pet.name.value,
      descricao: pet.descricao,
      foto_url: pet.foto.url,
      category: pet.category,
      dono_id: pet.donoId,
    });

    if (error) {
      console.error('Error saving pet profile:', error);
      throw new Error(error.message);
    }
  }


async findById(id: string): Promise<PetPerfil | null> {
 const { data, error } = await supabase
 .from('pet_perfis')
 .select('*')
 .eq('id', id)
 .single();

  if (error && error.code !== 'PGRST116') { 
     throw new Error(error.message);
  }
  if (!data) {
    return null;
  }


    return PetPerfil.reconstitute(
      data.id, 
      Name.create(data.name),
      Photo.create(data.foto_url),
      data.category,  
      data.descricao, 
      data.dono_id   
    );
   }


  async findAll(): Promise<PetPerfil[]> {
    const { data, error } = await supabase.from('pet_perfis').select('*');

    if (error) {
      throw new Error(error.message);
    }
    if (!data) {
        return [];
    }

return data.map(item =>
      PetPerfil.reconstitute(
        item.id,
        Name.create(item.name), 
        Photo.create(item.foto_url),
        item.category,
        item.descricao,
        item.dono_id
      )
    );

  }


  async findByDonoId(donoId: string): Promise<PetPerfil[]> {
  const { data, error } = await supabase
    .from('pet_perfis')
    .select('*')
    .eq('dono_id', donoId);

  if (error) {
    throw new Error(error.message);
  }

  if (!data) {
    return [];
  }

  return data.map(item =>
      PetPerfil.reconstitute(
        item.id,
        Name.create(item.name), 
        Photo.create(item.foto_url),
        item.category,
        item.descricao,
        item.dono_id
      )
    );
}

 
  async update(pet: PetPerfil): Promise<void> {
    const { error } = await supabase
      .from('pet_perfis')
      .update({
        name: pet.name.value,
        descricao: pet.descricao,
        foto_url: pet.foto.url,
        category: pet.category,
   
      })
      .eq('id', pet.id);

    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Deleta um perfil de pet pelo seu ID.
   */
  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('pet_perfis').delete().eq('id', id);
    
    if (error) {
      throw new Error(error.message);
    }
  }

  /**
   * Limpa o repositório (usado apenas em mocks, não se aplica ao Supabase).
   * Podemos deixar vazio ou lançar um erro se for chamado.
   */
  clear(): void {
  
    console.warn("O método 'clear' não é implementado em SupabasePetPerfilRepository.");
  }
}