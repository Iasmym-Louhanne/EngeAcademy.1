import { Permission, PermissionProfile } from './permissions';

// Perfis de permissão internos da EngeAcademy
const internalPermissionProfiles: PermissionProfile[] = [
  {
    id: 'admin',
    name: 'Administrador',
    description: 'Acesso total a todas as funcionalidades e filiais.',
    permissions: [
      'manage:users', 'view:users',
      'manage:permissions', 'view:permissions',
      'manage:clients', 'view:clients',
      'manage:courses', 'view:courses',
      'manage:branches', 'view:branches',
      'manage:financials', 'view:financials',
      'export:reports', 'view:reports',
      'issue:certificates', 'view:certificates',
      'manage:coupons', 'view:coupons'
    ],
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Visualiza relatórios e gerencia usuários de filiais específicas.',
    permissions: [
      'view:users',
      'view:clients',
      'view:courses',
      'view:branches',
      'export:reports', 'view:reports',
      'view:certificates'
    ],
  },
  {
    id: 'commercial',
    name: 'Comercial',
    description: 'Gerencia clientes, vendas e cupons.',
    permissions: [
      'manage:clients', 'view:clients',
      'view:courses',
      'view:financials',
      'manage:coupons', 'view:coupons'
    ],
  },
  {
    id: 'support',
    name: 'Suporte',
    description: 'Ajuda usuários e resolve problemas técnicos.',
    permissions: [
      'view:users',
      'view:clients',
      'view:courses'
    ],
  },
];

// Função para obter todos os perfis de permissão internos
export const getInternalPermissionProfiles = (): PermissionProfile[] => {
  return internalPermissionProfiles;
};

// Função para obter um perfil por ID
export const getProfileById = (id: string): PermissionProfile | undefined => {
  return internalPermissionProfiles.find(p => p.id === id);
};