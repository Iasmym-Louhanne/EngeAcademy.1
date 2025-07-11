import { Permission, PermissionProfile } from './permissions';

// Perfis de permissão internos da EngeAcademy - agora mutável
let internalPermissionProfiles: PermissionProfile[] = [
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
  return [...internalPermissionProfiles];
};

// Função para obter um perfil por ID
export const getProfileById = (id: string): PermissionProfile | undefined => {
  return internalPermissionProfiles.find(p => p.id === id);
};

// Função para criar um novo perfil de permissão
export const createPermissionProfile = (profileData: Omit<PermissionProfile, 'id'>): PermissionProfile => {
  const newProfile: PermissionProfile = {
    id: `profile-${Date.now()}`,
    ...profileData,
  };
  internalPermissionProfiles.push(newProfile);
  return newProfile;
};

// Função para atualizar um perfil de permissão
export const updatePermissionProfile = (id: string, updates: Partial<PermissionProfile>): PermissionProfile | undefined => {
  const profileIndex = internalPermissionProfiles.findIndex(p => p.id === id);
  if (profileIndex === -1) {
    return undefined;
  }
  const updatedProfile = { ...internalPermissionProfiles[profileIndex], ...updates };
  internalPermissionProfiles[profileIndex] = updatedProfile;
  return updatedProfile;
};

// Função para excluir um perfil de permissão
export const deletePermissionProfile = (id: string): boolean => {
  const initialLength = internalPermissionProfiles.length;
  internalPermissionProfiles = internalPermissionProfiles.filter(p => p.id !== id);
  return internalPermissionProfiles.length < initialLength;
};