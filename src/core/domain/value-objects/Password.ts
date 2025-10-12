export class Password {
  private constructor(readonly value: string) {}

  static create(password: string): Password {
    if (!this.validate(password)) {
      throw new Error('Invalid password');
    }
    return new Password(password);
  }

  private static validate(password: string): boolean {
    return password.length >= 8;
  }

}