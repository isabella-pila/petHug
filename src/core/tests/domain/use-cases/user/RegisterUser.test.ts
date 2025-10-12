import { IUserRepository } from '../../../../domain/repositories/UserRepository';
import { RegisterUser } from '../../../../domain/use-cases/user/RegisterUser';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';

describe('RegisterUser', () => {
  beforeEach(() => {
    MockUserRepository.getInstance().reset();
  });
  it('should register a new user', async () => {
    const userRepository: IUserRepository = MockUserRepository.getInstance();
    const registerUser = new RegisterUser(userRepository);

    const user = await registerUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      latitude: 40.7128,
      longitude: -74.0060,
    });

    expect(user).toBeDefined();
    expect(user.name.value).toBe('John Doe');
    expect(user.email.value).toBe('john.doe@example.com');

    const foundUser = await userRepository.findByEmail('john.doe@example.com');
    expect(foundUser).toBe(user);
  });

  it('should throw an error if the user already exists', async () => {
    const userRepository: IUserRepository = MockUserRepository.getInstance();
    const registerUser = new RegisterUser(userRepository);

    await registerUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      latitude: 40.7128,
      longitude: -74.0060,
    });

    await expect(
      registerUser.execute({
        name: 'Jane Doe',
        email: 'john.doe@example.com',
        password: 'password456',
        latitude: 40.7129,
        longitude: -74.0061,
      })
    ).rejects.toThrow('User already exists');
  });
});