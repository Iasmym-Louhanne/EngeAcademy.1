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
  created_at?: string;
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

/**
 * Verifica se um usuário possui uma permissão específica.
 * @param userPermissions - Array de permissões do usuário.
 * @param requiredPermission - A permissão necessária.
 * @returns `true` se o usuário tiver a permissão, caso contrário `false`.
 */
export function hasPermission(
  userPermissions: Permission[] | null | undefined,
  requiredPermission: Permission
): boolean {
  if (!userPermissions) {
    return false;
  }
  
  // O administrador pode ter uma permissão "catch-all" ou simplesmente todas as permissões.
  // Por enquanto, uma verificação simples é suficiente.
  return userPermissions.includes(requiredPermission);
}