export class LogoutUser {
  constructor() {}

  async execute(params: { userId: string }): Promise<void> {
    // In a real-world scenario, this would invalidate a token or session.
    // For this example, we don't have a session to invalidate.
    console.log(`User ${params.userId} logged out.`);
  }
}