import { supabase } from "../integrations/supabase/client";

export interface InternalUser {
  id: string;
  email: string;
  full_name: string;
  profile_id: string; // Foreign key to permission_profiles
  accessible_branches: string[];
  has_full_access: boolean;
  is_active: boolean;
  created_at: string;
}

export const getInternalUsers = async (): Promise<InternalUser[]> => {
  const { data, error } = await supabase
    .from('internal_users')
    .select('*')
    .order('full_name', { ascending: true });

  if (error) {
    console.error("Erro ao buscar usuários internos:", error);
    throw error;
  }
  return data;
};

export const createInternalUser = async (userData: Omit<InternalUser, 'id' | 'created_at'>): Promise<InternalUser> => {
  const { data, error } = await supabase
    .from('internal_users')
    .insert([userData])
    .select()
    .single();

  if (error) {
    console.error("Erro ao criar usuário interno:", error);
    throw error;
  }
  return data;
};

export const updateInternalUser = async (id: string, updates: Partial<InternalUser>): Promise<InternalUser> => {
  const { data, error } = await supabase
    .from('internal_users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Erro ao atualizar usuário interno ${id}:`, error);
    throw error;
  }
  return data;
};

export const deleteInternalUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('internal_users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Erro ao excluir usuário interno ${id}:`, error);
    throw error;
  }
  return true;
};