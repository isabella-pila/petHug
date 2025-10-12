import { LoginUser } from '../../../../domain/use-cases/user/LoginUser';
import { RegisterUser } from '../../../../domain/use-cases/user/RegisterUser';
import { MockUserRepository } from '../../../../infra/repositories/MockUserRepository';

describe('LoginUser', () => {
  it('should login a user', async () => {
    const userRepository = new MockUserRepository();
    const registerUser = new RegisterUser(userRepository);
    const loginUser = new LoginUser(userRepository);

    await registerUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      latitude: 40.7128,
      longitude: -74.006,
    });

    const user = await loginUser.execute({
      email: 'john.doe@example.com',
      password: 'password123',
    });

    expect(user).toBeDefined();
    expect(user.email.value).toBe('john.doe@example.com');
  });

  it('should throw an error for non-existent user', async () => {
    const userRepository = new MockUserRepository();
    const loginUser = new LoginUser(userRepository);

    await expect(
      loginUser.execute({
        email: 'non.existent@example.com',
        password: 'password123',
      })
    ).rejects.toThrow('Invalid credentials');
  });

  it('should throw an error for incorrect password', async () => {
    const userRepository = new MockUserRepository();
    const registerUser = new RegisterUser(userRepository);
    const loginUser = new LoginUser(userRepository);

    await registerUser.execute({
      name: 'John Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      latitude: 40.7128,
      longitude: -74.006,
    });

    await expect(
      loginUser.execute({
        email: 'john.doe@example.com',
        password: 'wrongpassword',
      })
    ).rejects.toThrow('Invalid credentials');
  });
});