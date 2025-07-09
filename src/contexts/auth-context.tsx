"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Role, hasPermission, Permission } from "@/lib/permissions";

// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationType?: 'empresa' | 'filial_empresa' | 'filial_engeacademy';
  organizationId?: string;
  organizationName?: string;
}

// Usuários de teste para cada perfil
export const testUsers = [
  {
    id: "aluno-1",
    name: "João Silva",
    email: "aluno@engeacademy.com",
    password: "senha123",
    role: "aluno" as Role,
  },
  {
    id: "empresa-1",
    name: "Construções ABC",
    email: "empresa@engeacademy.com",
    password: "senha123",
    role: "empresa" as Role,
    organizationType: "empresa" as const,
    organizationId: "org-1",
    organizationName: "Construções ABC Ltda."
  },
  {
    id: "filial-1",
    name: "Filial São Paulo",
    email: "filial@engeacademy.com",
    password: "senha123",
    role: "filial" as Role,
    organizationType: "filial_empresa" as const,
    organizationId: "org-1-filial-1",
    organizationName: "Construções ABC - São Paulo"
  },
  {
    id: "admin-1",
    name: "Admin EngeAcademy",
    email: "admin@engeacademy.com",
    password: "senha123",
    role: "admin" as Role,
    organizationType: "filial_engeacademy" as const,
    organizationId: "engeacademy-hq",
    organizationName: "EngeAcademy - Matriz"
  },
  {
    id: "supervisor-1",
    name: "Supervisor de Treinamentos",
    email: "supervisor@engeacademy.com",
    password: "senha123",
    role: "supervisor" as Role,
    organizationType: "filial_engeacademy" as const,
    organizationId: "engeacademy-sp",
    organizationName: "EngeAcademy - São Paulo"
  },
  {
    id: "instrutor-1",
    name: "Instrutor de Cursos",
    email: "instrutor@engeacademy.com",
    password: "senha123",
    role: "instrutor" as Role,
    organizationType: "filial_engeacademy" as const,
    organizationId: "engeacademy-sp",
    organizationName: "EngeAcademy - São Paulo"
  }
];

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
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

  // Verificar permissão do usuário atual
  const checkPermission = (permission: Permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      hasPermission: checkPermission
    }}>
      {children}
    </AuthContext.Provider>
  );
}