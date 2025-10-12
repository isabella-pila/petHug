import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/UserRepository';

export class FindUser {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(params: { id: string }): Promise<User | null> {
    return this.userRepository.findById(params.id);
  }
}