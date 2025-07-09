"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Role, hasPermission, Permission, Branch } from "@/lib/permissions";

// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  organizationType?: 'empresa' | 'filial_engeacademy';
  organizationId?: string;
  organizationName?: string;
  accessibleBranches?: string[]; // IDs das filiais que o usuário pode acessar
  currentBranch?: Branch; // Filial atualmente selecionada
}

// Lista de filiais
export const branches: Branch[] = [
  {
    id: "branch-1",
    name: "EngeAcademy Ceará",
    address: "Av. Santos Dumont, 1000",
    city: "Fortaleza",
    state: "CE",
    phone: "(85) 3333-4444",
    email: "ceara@engeacademy.com",
    manager: "Ana Silva",
    isActive: true
  },
  {
    id: "branch-2",
    name: "EngeAcademy Belo Horizonte",
    address: "Av. Amazonas, 2500",
    city: "Belo Horizonte",
    state: "MG",
    phone: "(31) 3333-4444",
    email: "bh@engeacademy.com",
    manager: "Roberto Oliveira",
    isActive: true
  },
  {
    id: "branch-3",
    name: "EngeAcademy Contagem",
    address: "Av. João César de Oliveira, 1500",
    city: "Contagem",
    state: "MG",
    phone: "(31) 3333-5555",
    email: "contagem@engeacademy.com",
    manager: "Carla Mendes",
    isActive: true
  },
  {
    id: "branch-4",
    name: "EngeAcademy São Paulo",
    address: "Av. Paulista, 1000",
    city: "São Paulo",
    state: "SP",
    phone: "(11) 3333-4444",
    email: "sp@engeacademy.com",
    manager: "Paulo Santos",
    isActive: true
  }
];

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
    id: "admin-1",
    name: "Admin EngeAcademy",
    email: "admin@engeacademy.com",
    password: "senha123",
    role: "admin" as Role,
    organizationType: "filial_engeacademy" as const,
    accessibleBranches: ["branch-1", "branch-2", "branch-3", "branch-4"], // Acesso a todas as filiais
  },
  {
    id: "supervisor-1",
    name: "Supervisor Ceará",
    email: "supervisor.ce@engeacademy.com",
    password: "senha123",
    role: "supervisor" as Role,
    organizationType: "filial_engeacademy" as const,
    accessibleBranches: ["branch-1"], // Acesso apenas à filial do Ceará
  },
  {
    id: "supervisor-2",
    name: "Supervisor Minas",
    email: "supervisor.mg@engeacademy.com",
    password: "senha123",
    role: "supervisor" as Role,
    organizationType: "filial_engeacademy" as const,
    accessibleBranches: ["branch-2", "branch-3"], // Acesso às filiais de MG
  },
  {
    id: "instrutor-1",
    name: "Instrutor de Cursos",
    email: "instrutor@engeacademy.com",
    password: "senha123",
    role: "instrutor" as Role,
    organizationType: "filial_engeacademy" as const,
    accessibleBranches: ["branch-1", "branch-4"], // Acesso às filiais de CE e SP
  }
];

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  selectBranch: (branchId: string) => void;
  availableBranches: Branch[];
  needsBranchSelection: boolean;
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
  
  // Estado para controlar se o usuário precisa selecionar uma filial
  const [needsBranchSelection, setNeedsBranchSelection] = useState(false);

  // Verificar se o usuário está logado ao carregar a página
  useEffect(() => {
    const storedUser = localStorage.getItem("engeacademy_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      
      // Se é admin ou supervisor e não tem filial selecionada, precisa selecionar
      if (
        (parsedUser.role === 'admin' || parsedUser.role === 'supervisor') && 
        !parsedUser.currentBranch && 
        parsedUser.accessibleBranches?.length > 0
      ) {
        setNeedsBranchSelection(true);
      }
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
      
      // Verificar se o usuário precisa selecionar uma filial
      const needsSelection = 
        (foundUser.role === 'admin' || foundUser.role === 'supervisor') && 
        foundUser.accessibleBranches?.length > 0;
      
      setNeedsBranchSelection(needsSelection);
      
      // Se usuário tiver acesso a apenas uma filial, selecionar automaticamente
      let userToStore = { ...userWithoutPassword };
      if (foundUser.accessibleBranches?.length === 1) {
        const branchId = foundUser.accessibleBranches[0];
        const branch = branches.find(b => b.id === branchId);
        if (branch) {
          userToStore.currentBranch = branch;
          setNeedsBranchSelection(false);
        }
      }
      
      setUser(userToStore);
      localStorage.setItem(
        "engeacademy_user",
        JSON.stringify(userToStore)
      );
      return true;
    }

    return false;
  };

  // Função de logout
  const logout = () => {
    setUser(null);
    setNeedsBranchSelection(false);
    localStorage.removeItem("engeacademy_user");
    router.push("/auth/login");
  };

  // Verificar permissão do usuário atual
  const checkPermission = (permission: Permission) => {
    if (!user) return false;
    return hasPermission(user.role, permission);
  };
  
  // Função para selecionar uma filial
  const selectBranch = (branchId: string) => {
    if (!user || !user.accessibleBranches?.includes(branchId)) return;
    
    const selectedBranch = branches.find(b => b.id === branchId);
    if (!selectedBranch) return;
    
    const updatedUser = {
      ...user,
      currentBranch: selectedBranch,
      organizationName: selectedBranch.name
    };
    
    setUser(updatedUser);
    setNeedsBranchSelection(false);
    localStorage.setItem("engeacademy_user", JSON.stringify(updatedUser));
  };
  
  // Obter filiais disponíveis para o usuário atual
  const getAvailableBranches = (): Branch[] => {
    if (!user || !user.accessibleBranches) return [];
    return branches.filter(branch => 
      user.accessibleBranches?.includes(branch.id) && branch.isActive
    );
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      logout, 
      isLoading,
      hasPermission: checkPermission,
      selectBranch,
      availableBranches: getAvailableBranches(),
      needsBranchSelection
    }}>
      {children}
    </AuthContext.Provider>
  );
}