import { Password } from '../../../domain/value-objects/Password';

describe('Password', () => {
  it('should create a valid password', () => {
    const password = Password.create('12345678');
    expect(password.value).toBe('12345678');
  });

  it('should throw an error for a password that is too short', () => {
    expect(() => Password.create('1234567')).toThrow('Invalid password');
  });
});