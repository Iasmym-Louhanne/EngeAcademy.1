import { supabase } from "@/integrations/supabase/client";
import { Permission, PermissionProfile } from './permissions';

// Função para obter todos os perfis de permissão internos do banco de dados
export const getInternalPermissionProfiles = async (): Promise<PermissionProfile[]> => {
  const { data, error } = await supabase
    .from('permission_profiles')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error("Erro ao buscar perfis de permissão:", error);
    throw error;
  }
  return data as PermissionProfile[];
};

// Função para obter um perfil por ID
export const getProfileById = async (id: string): Promise<PermissionProfile | null> => {
  const { data, error } = await supabase
    .from('permission_profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Erro ao buscar perfil com ID ${id}:`, error);
    return null;
  }
  return data as PermissionProfile;
};

// Função para criar um novo perfil de permissão
export const createPermissionProfile = async (profileData: Omit<PermissionProfile, 'id' | 'created_at'>): Promise<PermissionProfile> => {
  const { data, error } = await supabase
    .from('permission_profiles')
    .insert([profileData])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar perfil de permissão:", error);
    throw error;
  }
  return data as PermissionProfile;
};

// Função para atualizar um perfil de permissão
export const updatePermissionProfile = async (id: string, updates: Partial<PermissionProfile>): Promise<PermissionProfile> => {
  const { data, error } = await supabase
    .from('permission_profiles')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar perfil ${id}:`, error);
    throw error;
  }
  return data as PermissionProfile;
};

// Função para excluir um perfil de permissão
export const deletePermissionProfile = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('permission_profiles')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao excluir perfil ${id}:`, error);
    throw error;
  }
  return true;
};