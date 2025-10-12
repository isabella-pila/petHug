export class GeoCoordinates {
  private constructor(readonly latitude: number, readonly longitude: number) {}

  static create(latitude: number, longitude: number): GeoCoordinates {
    if (!this.validate(latitude, longitude)) {
      throw new Error('Invalid geo coordinates');
    }
    return new GeoCoordinates(latitude, longitude);
  }

  private static validate(latitude: number, longitude: number): boolean {
    return latitude >= -90 && latitude <= 90 && longitude >= -180 && longitude <= 180;
  }
}