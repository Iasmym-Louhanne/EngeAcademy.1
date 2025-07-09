export type Permission = 
  | 'view:employees'
  | 'edit:employees'
  | 'delete:employees'
  | 'view:courses'
  | 'edit:courses'
  | 'delete:courses'
  | 'view:reports'
  | 'export:reports'
  | 'view:certificates'
  | 'issue:certificates'
  | 'view:vouchers'
  | 'create:vouchers'
  | 'assign:courses'
  | 'view:financials'
  | 'edit:financials'
  | 'view:branches'
  | 'edit:branches'
  | 'manage:users'
  | 'configure:company';

export type Role = 'aluno' | 'empresa' | 'filial' | 'admin' | 'supervisor' | 'instrutor';

// Mapeamento de permissões por papel
const rolePermissions: Record<Role, Permission[]> = {
  aluno: [
    'view:courses',
    'view:certificates',
    'view:vouchers'
  ],
  empresa: [
    'view:employees',
    'edit:employees',
    'view:courses',
    'view:reports',
    'export:reports',
    'view:certificates',
    'view:vouchers',
    'assign:courses',
    'view:branches',
    'configure:company'
  ],
  filial: [
    'view:employees',
    'edit:employees',
    'view:courses',
    'view:reports',
    'export:reports',
    'view:certificates',
    'view:branches'
  ],
  admin: [
    'view:employees',
    'edit:employees',
    'delete:employees',
    'view:courses',
    'edit:courses',
    'delete:courses',
    'view:reports',
    'export:reports',
    'view:certificates',
    'issue:certificates',
    'view:vouchers',
    'create:vouchers',
    'assign:courses',
    'view:financials',
    'edit:financials',
    'view:branches',
    'edit:branches',
    'manage:users',
    'configure:company'
  ],
  supervisor: [
    'view:employees',
    'view:courses',
    'view:reports',
    'export:reports',
    'view:certificates',
    'view:branches'
  ],
  instrutor: [
    'view:courses',
    'view:reports',
    'view:certificates'
  ]
};

// Função para verificar se um usuário tem uma determinada permissão
export function hasPermission(role: Role, permission: Permission): boolean {
  return rolePermissions[role]?.includes(permission) || false;
}