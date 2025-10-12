import { IUserRepository } from '../domain/repositories/UserRepository';
import { LoginUser } from '../domain/use-cases/user/LoginUser';
import { LogoutUser } from '../domain/use-cases/user/LogoutUser';
import { RegisterUser } from '../domain/use-cases/user/RegisterUser';
import { MockUserRepository } from '../infra/repositories/MockUserRepository';
import { FindUser } from '../domain/use-cases/user/FindUser';

export function makeUserUseCases() {
  const userRepository: IUserRepository = MockUserRepository.getInstance();

  const registerUser = new RegisterUser(userRepository);
  const loginUser = new LoginUser(userRepository);
  const logoutUser = new LogoutUser();
  const findUser = new FindUser(userRepository);

  return {
    registerUser,
    loginUser,
    logoutUser,
    findUser,
  };
}