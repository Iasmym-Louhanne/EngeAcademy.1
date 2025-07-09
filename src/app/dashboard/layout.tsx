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

  // Mostrar nada enquanto verifica a autenticação
  if (isLoading || !user) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="animate-pulse text-lg font-medium">Carregando...</div>
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