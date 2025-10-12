import { MockUserRepository } from '../../infra/repositories/MockUserRepository';
import { User } from '../../domain/entities/User';
import { Name } from '../../domain/value-objects/Name';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { GeoCoordinates } from '../../domain/value-objects/GeoCoordinates';
import { IUserRepository } from '../../domain/repositories/UserRepository';

describe('MockUserRepository', () => {
  it('should not throw when updating a non-existent user', async () => {
    const userRepository: IUserRepository = MockUserRepository.getInstance();
    const user = User.create(
      '1',
      Name.create('John Doe'),
      Email.create('john.doe@example.com'),
      Password.create('password123'),
      GeoCoordinates.create(40.7128, -74.0060)
    );

    await expect(userRepository.update(user)).resolves.not.toThrow();
  });
});