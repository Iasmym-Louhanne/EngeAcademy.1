"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "../integrations/supabase/client";
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
  currentBranch?: string;
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

  const fetchUserAndPermissions = async (
    authUser: SupabaseUser
  ): Promise<ExtendedUser> => {
    const { data: userProfile, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .single();

    if (error || !userProfile) {
      console.error("Erro ao buscar perfil:", error?.message);
      return { ...authUser, permissions: [] };
    }

    setProfile(userProfile);

    if (
      userProfile.profile_id &&
      userProfile.profile_id !== "aluno"
    ) {
      const { data: permissionProfile } = await supabase
        .from("permission_profiles")
        .select("permissions")
        .eq("id", userProfile.profile_id)
        .single();

      return {
        ...authUser,
        profileId: userProfile.profile_id,
        permissions: permissionProfile?.permissions || [],
      };
    }

    return {
      ...authUser,
      profileId: userProfile.profile_id || "aluno",
      permissions: [],
    };
  };

  useEffect(() => {
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const fullUser = await fetchUserAndPermissions(session.user);
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
          const fullUser = await fetchUserAndPermissions(session.user);
          setUser(fullUser);
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
    router.push("/auth/login");
  };

  const value = {
    user,
    profile,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
