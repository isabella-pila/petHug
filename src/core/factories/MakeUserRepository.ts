// src/core/factories/MakeUserRepository.ts

import { IUserRepository } from '../domain/repositories/UserRepository';
import { LoginUser } from '../domain/use-cases/user/LoginUser';
import { LogoutUser } from '../domain/use-cases/user/LogoutUser';
import { RegisterUser } from '../domain/use-cases/user/RegisterUser';
import { FindUser } from '../domain/use-cases/user/FindUser';
import { SupabaseUserRepository } from '../infra/repositories/supabaseUserRepository';
// Importe o MockUserRepository se você planeja usá-lo em testes
// import { MockUserRepository } from '../infra/repositories/MockUserRepository';

export function makeUserUseCases() {
  
  // ✅ 1. Cria a instância do repositório CORRETAMENTE
  // Vamos usar o Supabase diretamente, já que é esse o seu objetivo.
  const userRepository: IUserRepository = SupabaseUserRepository.getInstance();
  
  // (Se você quisesse usar a variável de ambiente, a sintaxe correta seria:)
  /*
  const userRepository: IUserRepository = process.env.EXPO_PUBLIC_USE_API === 'true'
    ? SupabaseUserRepository.getInstance()
    : MockUserRepository.getInstance();
  */

  // ✅ 2. Injeta o repositório em TODOS os use cases
  const registerUser = new RegisterUser(userRepository);
  const loginUser = new LoginUser(userRepository);

  const findUser = new FindUser(userRepository);

  return {
    registerUser,
    loginUser,
    findUser,
  };
}