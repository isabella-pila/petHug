import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/UserRepository';
import { Name } from '../../value-objects/Name';
import { Email } from '../../value-objects/Email';
import { Password } from '../../value-objects/Password';
import { GeoCoordinates } from '../../value-objects/GeoCoordinates';

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: {
    name: string;
    email: string;
    password: string;
    latitude: number;
    longitude: number;
  }): Promise<User> {
    const { name, email, password, latitude, longitude } = params;

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      throw new Error('User already exists');
    }

    const hashedPassword = await this.hashPassword(password);

    const user = User.create(
      Math.random().toString(),
      Name.create(name),
      Email.create(email),
      Password.create(hashedPassword),
      GeoCoordinates.create(latitude, longitude)
    );

    await this.userRepository.save(user);

    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    return `hashed_${password}`;
  }
}