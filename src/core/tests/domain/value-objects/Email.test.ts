import { Email } from '../../../domain/value-objects/Email';

describe('Email', () => {
  it('should create a valid email', () => {
    const email = Email.create('test@example.com');
    expect(email.value).toBe('test@example.com');
  });

  it('should throw an error for an invalid email', () => {
    expect(() => Email.create('invalid-email')).toThrow('Invalid email');
  });
});