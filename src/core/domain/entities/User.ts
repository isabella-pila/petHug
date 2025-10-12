import { Email } from '../value-objects/Email';
import { GeoCoordinates } from '../value-objects/GeoCoordinates';
import { Name } from '../value-objects/Name';
import { Password } from '../value-objects/Password';

export class User {
  private constructor(
    readonly id: string,
    readonly name: Name,
    readonly email: Email,
    readonly password: Password,
    readonly location: GeoCoordinates
  ) {}

  static create(
    id: string,
    name: Name,
    email: Email,
    password: Password,
    location: GeoCoordinates
  ): User {
    return new User(id, name, email, password, location);
  }
}