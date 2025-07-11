"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";

interface ExtendedUser extends SupabaseUser {
  profileId?: string;
}

export interface UserProfile {
  id: string;
  full_name: string;
  avatar_url: string;
  profile_id?: string;
  currentBranch?: string; // Inclua isso se for usado nos dashboards
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

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(userProfile ?? null);

        setUser({
          ...session.user,
          profileId: userProfile?.profile_id ?? undefined,
        });
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
          const { data: userProfile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setProfile(userProfile ?? null);

          setUser({
            ...session.user,
            profileId: userProfile?.profile_id ?? undefined,
          });

          if (event === 'SIGNED_IN' && pathname === '/auth/login') {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('profile_id')
            .eq('id', session.user.id)
            .single();

          const profileId = profileData?.profile_id;

          const pathByRole: Record<string, string> = {
            admin: '/dashboard/admin',
            supervisor: '/dashboard/empresa',
            commercial: '/dashboard/empresa',
            support: '/dashboard/admin',
          };

          const redirectPath = pathByRole[profileId] ?? '/dashboard/aluno';
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