"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { Permission, Branch, PermissionProfile } from "@/lib/permissions";
import { getProfileById } from "@/lib/permission-service";

// Interface para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  profileId: string; // ID do perfil de permissão
  accessibleBranches: string[]; // IDs das filiais que o usuário pode acessar
  hasFullAccess: boolean; // Se tem acesso a todas as filiais (modo admin)
  currentBranch?: Branch; // Filial atualmente selecionada
  isActive: boolean;
}

// Lista de filiais
export const branches: Branch[] = [
  { id: "branch-1", name: "EngeAcademy Ceará", address: "Av. Santos Dumont, 1000", city: "Fortaleza", state: "CE", manager: "Ana Silva", isActive: true },
  { id: "branch-2", name: "EngeAcademy Belo Horizonte", address: "Av. Amazonas, 2500", city: "Belo Horizonte", state: "MG", manager: "Roberto Oliveira", isActive: true },
  { id: "branch-3", name: "EngeAcademy Contagem", address: "Av. João César de Oliveira, 1500", city: "Contagem", state: "MG", manager: "Carla Mendes", isActive: true },
  { id: "branch-4", name: "EngeAcademy São Paulo", address: "Av. Paulista, 1000", city: "São Paulo", state: "SP", manager: "Paulo Santos", isActive: true }
];

// Usuários de teste para cada perfil
export const testUsers: User[] = [
  { id: "user-admin", name: "Admin EngeAcademy", email: "admin@engeacademy.com", profileId: "admin", accessibleBranches: [], hasFullAccess: true, isActive: true },
  { id: "user-supervisor", name: "Supervisor Regional", email: "supervisor@engeacademy.com", profileId: "supervisor", accessibleBranches: ["branch-2", "branch-3"], hasFullAccess: false, isActive: true },
  { id: "user-commercial", name: "Consultor Comercial", email: "comercial@engeacademy.com", profileId: "commercial", accessibleBranches: ["branch-4"], hasFullAccess: false, isActive: true },
  { id: "user-support", name: "Analista de Suporte", email: "suporte@engeacademy.com", profileId: "support", accessibleBranches: ["branch-1"], hasFullAccess: false, isActive: true },
];

// Interface para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  login: (email: string) => Promise<boolean>; // Senha removida para simplificar
  logout: () => void;
  isLoading: boolean;
  hasPermission: (permission: Permission) => boolean;
  selectBranch: (branchId: string) => void;
  availableBranches: Branch[];
  needsBranchSelection: boolean;
  branches: Branch[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [needsBranchSelection, setNeedsBranchSelection] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("engeacademy_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      if (parsedUser.hasFullAccess === false && !parsedUser.currentBranch && parsedUser.accessibleBranches.length > 1) {
        setNeedsBranchSelection(true);
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string) => {
    const foundUser = testUsers.find(u => u.email === email);
    if (foundUser) {
      let userToStore = { ...foundUser };
      const needsSelection = !userToStore.hasFullAccess && userToStore.accessibleBranches.length > 1;
      setNeedsBranchSelection(needsSelection);

      if (!userToStore.hasFullAccess && userToStore.accessibleBranches.length === 1) {
        userToStore.currentBranch = branches.find(b => b.id === userToStore.accessibleBranches[0]);
        setNeedsBranchSelection(false);
      }
      
      setUser(userToStore);
      localStorage.setItem("engeacademy_user", JSON.stringify(userToStore));
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    setNeedsBranchSelection(false);
    localStorage.removeItem("engeacademy_user");
    router.push("/auth/login");
  };

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;
    const profile = getProfileById(user.profileId);
    return profile?.permissions.includes(permission) ?? false;
  };

  const selectBranch = (branchId: string) => {
    if (!user) return;
    const selectedBranch = branches.find(b => b.id === branchId);
    if (selectedBranch && (user.hasFullAccess || user.accessibleBranches.includes(branchId))) {
      const updatedUser = { ...user, currentBranch: selectedBranch };
      setUser(updatedUser);
      localStorage.setItem("engeacademy_user", JSON.stringify(updatedUser));
      setNeedsBranchSelection(false);
    }
  };

  const getAvailableBranches = (): Branch[] => {
    if (!user) return [];
    if (user.hasFullAccess) return branches.filter(b => b.isActive);
    return branches.filter(b => user.accessibleBranches.includes(b.id) && b.isActive);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, hasPermission, selectBranch, availableBranches: getAvailableBranches(), needsBranchSelection, branches }}>
      {children}
    </AuthContext.Provider>
  );
}