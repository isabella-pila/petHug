import DatabaseConnection from './connection';
import { IPetPerfilRepository } from '../../domain/repositories/PetPerfilRepository';
import { PetPerfil } from '../../domain/entities/PetPerfil';
import { Name } from '../../domain/value-objects/Name';
import { Photo } from '../../domain/value-objects/Photo';


export class SQLitePetPerfilRepository implements IPetPerfilRepository {
  private static instance: SQLitePetPerfilRepository;

  private constructor() {}

  public static getInstance(): SQLitePetPerfilRepository {
    if (!SQLitePetPerfilRepository.instance) {
      SQLitePetPerfilRepository.instance = new SQLitePetPerfilRepository();
    }
    return SQLitePetPerfilRepository.instance;
  }

  async save(pet: PetPerfil, syncStatus: string = 'pending_create'): Promise<void> {
    const db = await DatabaseConnection.getConnection();
    
  
    await db.runAsync(
      `INSERT OR REPLACE INTO pets (
         id, name, description, photo_url, category, owner_id, sync_status
       ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      pet.id,
      pet.name.value,
      pet.descricao,
      pet.foto.url,
      pet.category,
      pet.donoId,
      syncStatus,
      'pending_create' 
    
    );
    
  }


  async findById(id: string): Promise<PetPerfil | null> {
    const db = await DatabaseConnection.getConnection();
    const petRow = await db.getFirstAsync<any>(
      'SELECT * FROM pets WHERE id = ?',
      id
    );

    if (petRow) {
      return PetPerfil.reconstitute(
        petRow.id,
        Name.create(petRow.name),
        Photo.create(petRow.photo_url),
        petRow.category,
        petRow.description, // No banco chamamos de description
        petRow.owner_id     // No banco chamamos de owner_id
      );
    }
    return null;
  }


  async findAll(): Promise<PetPerfil[]> {
    const db = await DatabaseConnection.getConnection();
    const petRows = await db.getAllAsync<any>('SELECT * FROM pets');
    
    return petRows.map(petRow =>
      PetPerfil.reconstitute(
        petRow.id,
        Name.create(petRow.name),
        Photo.create(petRow.photo_url),
        petRow.category,
        petRow.description,
        petRow.owner_id
      )
    );
  }


  async findByDonoId(donoId: string): Promise<PetPerfil[]> {
    const db = await DatabaseConnection.getConnection();
    const petRows = await db.getAllAsync<any>(
        'SELECT * FROM pets WHERE owner_id = ?', 
        donoId
    );
    
    return petRows.map(petRow =>
      PetPerfil.reconstitute(
        petRow.id,
        Name.create(petRow.name),
        Photo.create(petRow.photo_url),
        petRow.category,
        petRow.description,
        petRow.owner_id
      )
    );
  }


  async update(pet: PetPerfil): Promise<void> {
    const db = await DatabaseConnection.getConnection();
    await db.runAsync(
      `UPDATE pets SET 
         name = ?, 
         description = ?, 
         photo_url = ?, 
         category = ?, 
         sync_status = CASE WHEN sync_status = 'synced' THEN 'pending_update' ELSE sync_status END 
       WHERE id = ?`,
      pet.name.value,
      pet.descricao,
      pet.foto.url,
      pet.category,
      pet.id
    );
  }


  async delete(id: string): Promise<void> {
    const db = await DatabaseConnection.getConnection();
    
    // 1. Registra no log para o SyncService saber que precisa deletar no Supabase
    await db.runAsync(
        "INSERT INTO sync_log (entity_type, entity_id, action) VALUES ('pet', ?, 'delete')", 
        id
    );
    
    // 2. Remove do banco local imediatamente
    await db.runAsync('DELETE FROM pets WHERE id = ?', id);
  }
}