export class Email {
  private constructor(readonly value: string) {}

  static create(email: string): Email {
    if (!this.validate(email)) {
      throw new Error('Invalid email');
    }
    return new Email(email);
  }

  private static validate(email: string): boolean {
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g;
    return emailRegex.test(email);
  }
}