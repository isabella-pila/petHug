import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useState } from "react";
import { makeUserUseCases } from "../core/factories/MakeUserRepository";
import { User } from "../core/domain/entities/User";

export interface IAuthContextData {
  login: boolean;
  setLogin: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  handleLogin(data: {email: string, password: string}): Promise<void>;
}

export interface IProvider {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider = ({ children }: IProvider) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const userUseCases = makeUserUseCases();

  const handleLogin = async (data: {email: string, password: string}) => {
    try {
      const loggedInUser = await userUseCases.loginUser.execute(data);
      setUser(loggedInUser);
      setLogin(true);
    } catch (error) {
      console.error("Login failed:", error);
    
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ login, setLogin, user, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): IAuthContextData {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used with an AuthProvider");
  }
  return context;
}