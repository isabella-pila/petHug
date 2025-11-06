import { createContext, Dispatch, ReactNode, SetStateAction, useContext, useEffect, useState } from "react";
import { makeUserUseCases } from "../core/factories/MakeUserRepository";
import { User } from "../core/domain/entities/User";
import { supabase } from '../core/infra/supabase/client/supabaseClient';
import { Session } from '@supabase/supabase-js';

export interface IAuthContextData {
  login: boolean;
  setLogin: Dispatch<SetStateAction<boolean>>;
  user: User | null;
  session: Session | null;
  handleLogin(data: { email: string, password: string }): Promise<void>;
  handleLogout(): Promise<void>;
}

export interface IProvider {
  children: ReactNode;
}

const AuthContext = createContext<IAuthContextData>({} as IAuthContextData);

export const AuthProvider = ({ children }: IProvider) => {
  const [login, setLogin] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const userUseCases = makeUserUseCases();

  useEffect(() => {
    async function fetchAuth() {
      const { data, error } = await supabase.auth.getSession();
      setSession(data.session);
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          console.log(`Supabase auth event: ${event}`);
          setSession(session);
        }
      );
      return () => {
        authListener!.subscription.unsubscribe();
      };
    }
    fetchAuth()
  }, [user]);

  const handleLogin = async (data: { email: string, password: string }) => {
    try {
      const loggedInUser = await userUseCases.loginUser.execute(data);
      setUser(loggedInUser);
      setLogin(true);
    } catch (error) {
      console.error("Login failed:", error);
      // Optionally, you can re-throw the error or handle it in another way
      throw error;
    }
  };
const handleLogout = async () => {
    try {
      // 1. Verificação de segurança
      // Se por algum motivo não houver usuário, apenas limpe o local.
      if (!user || !user.id) {
        console.warn("Tentativa de logout sem usuário no estado.");
        setUser(null);
        setLogin(false);
        setSession(null);
        return; 
      }

      // 2. A CORREÇÃO:
      // Passe o ID do usuário que está no estado 'user'
      await userUseCases.logoutUser.execute({ userId: user.id }); 
      
      // 3. Limpa o estado local
      setUser(null);
      setLogin(false);
      setSession(null); 

    } catch (error) {
      console.error("Logout failed:", error);
      // Força o logout local mesmo se o 'execute' falhar
      setUser(null);
      setLogin(false);
      setSession(null);
    }
  };

  return (
    <AuthContext.Provider value={{ login, setLogin, user, session, handleLogin, handleLogout }}>
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