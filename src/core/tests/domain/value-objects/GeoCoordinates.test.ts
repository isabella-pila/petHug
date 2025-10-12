import { GeoCoordinates } from '../../../domain/value-objects/GeoCoordinates';

describe('GeoCoordinates', () => {
  it('should create valid geo coordinates', () => {
    const coords = GeoCoordinates.create(40.7128, -74.0060);
    expect(coords.latitude).toBe(40.7128);
    expect(coords.longitude).toBe(-74.0060);
  });

  it('should throw an error for invalid latitude', () => {
    expect(() => GeoCoordinates.create(100, 0)).toThrow('Invalid geo coordinates');
  });

  it('should throw an error for invalid longitude', () => {
    expect(() => GeoCoordinates.create(0, 200)).toThrow('Invalid geo coordinates');
  });
});