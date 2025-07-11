"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Permission } from "@/lib/permissions";

interface ExtendedUser extends SupabaseUser {
  profileId?: string;
  permissions?: Permission[];
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  profile_id?: string;
}

interface AuthContextType {
  user: ExtendedUser | null;
  profile: UserProfile | null;
  logout: () => Promise<void>;
  isLoading: boolean;
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
  const router = useRouter();
  const pathname = usePathname();

  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserPermissions = async (userId: string): Promise<ExtendedUser | null> => {
    const { data: userProfile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (profileError || !userProfile) {
      return null;
    }

    setProfile(userProfile);

    // Se for um usuário interno, buscar permissões
    if (userProfile.profile_id && userProfile.profile_id !== 'aluno') {
      const { data: internalUser, error: internalUserError } = await supabase
        .from('internal_users')
        .select('profile_id')
        .eq('email', userProfile.email) // ou usar ID se for o mesmo
        .single();

      if (internalUser && !internalUserError) {
        const { data: permissionProfile, error: permError } = await supabase
          .from('permission_profiles')
          .select('permissions')
          .eq('id', internalUser.profile_id)
          .single();
        
        if (permissionProfile && !permError) {
          return {
            ...user,
            profileId: userProfile.profile_id,
            permissions: permissionProfile.permissions as Permission[],
          };
        }
      }
    }

    // Retornar usuário sem permissões especiais (aluno)
    return {
      ...user,
      profileId: userProfile.profile_id,
      permissions: [],
    };
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const fullUser = await fetchUserPermissions(session.user.id);
        setUser(fullUser);
      } else {
        setUser(null);
        setProfile(null);
      }

      setIsLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const fullUser = await fetchUserPermissions(session.user.id);
          setUser(fullUser);

          if (event === 'SIGNED_IN' && pathname === '/auth/login') {
            const redirectPath = fullUser?.profileId === 'admin' ? '/dashboard/admin' : '/dashboard/aluno';
            router.push(redirectPath);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router, pathname]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/auth/login');
  };

  const value = {
    user,
    profile,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}