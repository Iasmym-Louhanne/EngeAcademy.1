// Definição de todas as permissões possíveis na plataforma
export type Permission = 
  // Usuários
  | 'manage:users'
  | 'view:users'
  
  // Perfis de Permissão
  | 'manage:permissions'
  | 'view:permissions'

  // Clientes (Empresas e Individuais)
  | 'manage:clients'
  | 'view:clients'
  
  // Cursos
  | 'manage:courses'
  | 'view:courses'
  
  // Filiais
  | 'manage:branches'
  | 'view:branches'
  
  // Financeiro
  | 'manage:financials'
  | 'view:financials'
  
  // Relatórios
  | 'export:reports'
  | 'view:reports'
  
  // Certificados
  | 'issue:certificates'
  | 'view:certificates'
  
  // Cupons
  | 'manage:coupons'
  | 'view:coupons';

// Interface para um Perfil de Permissão
export interface PermissionProfile {
  id: string;
  name: string;
  description: string;
  permissions: Permission[];
}

// Interface para uma Filial
export interface Branch {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  phone?: string;
  email?: string;
  manager?: string;
  isActive: boolean;
}