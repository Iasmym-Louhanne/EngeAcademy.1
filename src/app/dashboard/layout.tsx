"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Toaster } from "sonner";
import { useAuth } from "@/contexts/auth-context";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  // Verificar se o usuário está autenticado
  useEffect(() => {
    if (!isLoading && !user) {
      // Redirecionar para a página de login se não estiver autenticado
      router.push("/auth/login");
    }
  }, [user, isLoading, router]);

  // Mostrar uma tela de carregamento enquanto verifica a autenticação
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="animate-pulse text-lg font-medium text-foreground">Carregando...</div>
      </div>
    );
  }

  return (
    <>
      {children}
      <Toaster position="top-right" />
    </>
  );
}