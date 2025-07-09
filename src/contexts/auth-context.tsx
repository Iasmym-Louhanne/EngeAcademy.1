"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

// Definição dos tipos de usuário
export type UserRole = "aluno" | "empresa" | "filial" | "admin";

// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

// Usuários de teste para cada perfil
export const testUsers = [
  {
    id: "aluno-1",
    name: "João Silva",
    email: "aluno@engeacademy.com",
    password: "senha123",
    role: "aluno" as UserRole,
  },
  {
    id: "empresa-1",
    name: "Construções ABC",
    email: "empresa@engeacademy.com",
    password: "senha123",
    role: "empresa" as UserRole,
  },
  {
    id: "filial-1",
    name: "Filial São Paulo",
    email: "filial@engeacademy.com",
    password: "senha123",
    role: "filial" as UserRole,
  },
  {
    id: "admin-1",
    name: "Admin EngeAcademy",
    email: "admin@engeacademy.com",
    password: "senha123",
    role: "admin" as UserRole,
  },
];

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Criação do contexto de autenticação
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto de autenticação
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

// Provider do contexto de autenticação
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("engeacademy_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  // Função de login
  const login = async (email: string, password: string) => {
    // Simulando uma chamada de API
    const foundUser = testUsers.find(
      (u) => u.email === email && u.password === password
    );

    if (foundUser) {
      // Extrair a senha antes de armazenar
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem(
        "engeacademy_user",
        JSON.stringify(userWithoutPassword)
      );
      return true;
    }

    return false;
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem("engeacademy_user");
    router.push("/auth/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}