import { PetPerfil } from '../../../domain/entities/PetPerfil';
import { Name } from '../../../domain/value-objects/Name';
import { Photo } from '../../../domain/value-objects/Photo';

describe('PetPerfil', () => {
  it('should create a valid vinyl record', () => {
    const record = PetPerfil.create(
    
      Name.create('Symon'),
      Photo.create('https://example.com/abbey-road.jpg'),
      'gato',
      'Descricao do pet',
      '1',
      
    );

    expect(record.id).toBeDefined();
    expect(typeof record.id).toBe('string');
    expect(record.id.length).toBeGreaterThan(0);
    expect(record.name.value).toBe('Symon');
    expect(record.foto.url).toBe('https://example.com/abbey-road.jpg');
    expect(record.category).toBe('gato');
    expect(record.descricao).toBe('Descricao do pet');
    expect(record.donoId).toBe('1');
   
  });
});


