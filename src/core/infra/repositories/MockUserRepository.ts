import { IUserRepository } from '../../domain/repositories/UserRepository';
import { User } from '../../domain/entities/User';
import { Name } from '../../domain/value-objects/Name';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { GeoCoordinates } from '../../domain/value-objects/GeoCoordinates';

export class MockUserRepository implements IUserRepository {
  private static instance: MockUserRepository;
  private users: User[] = [{
    id: "user-1-mock",
    name: Name.create("Isabella"),
    email: Email.create("Isabella@gmail.com"),
    password: Password.create("hashed_123"),
    location: GeoCoordinates.create(50, 100)
  }];

  private constructor() { }

  public static getInstance(): MockUserRepository {
    if (!MockUserRepository.instance) {
      MockUserRepository.instance = new MockUserRepository();
    }
    return MockUserRepository.instance;
  }

  async register(user: User): Promise<User> {
    this.users.push(user);
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email.value === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async update(user: User): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === user.id);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  public reset(): void {
    this.users = [];
  }

  async authenticate(email: string, password: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }
    const isPasswordValid = `hashed_${password}` === user.password.value;
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }
    return user;
  }


  async findAll(): Promise<User[]> {
   
    console.log("Mock: Buscando todos os usuários (retornando vazio)");
    return [];
  }


}