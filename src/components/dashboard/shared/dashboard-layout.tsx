"use client";

import { useState, ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Users,
  BookOpen,
  Award,
  Building2,
  FileText,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  LayoutDashboard,
  Shield,
  Ticket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DashboardHeader } from "./dashboard-header";
import { useAuth } from "@/contexts/auth-context";
import { ScrollArea } from "@/components/ui/scroll-area";

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
  permission?: string;
};

type DashboardLayoutProps = {
  children: ReactNode;
  userType: "aluno" | "empresa" | "admin";
};

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  // Detectar se estamos em um dispositivo móvel
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  const navItems: Record<string, NavItem[]> = {
    aluno: [
      {
        title: "Meus Cursos",
        href: "/dashboard/aluno",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "Certificados",
        href: "/dashboard/aluno/certificados",
        icon: <Award className="h-5 w-5" />,
      },
      {
        title: "Vouchers",
        href: "/dashboard/aluno/vouchers",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: "Perfil",
        href: "/dashboard/aluno/perfil",
        icon: <User className="h-5 w-5" />,
      },
    ],
    empresa: [
      {
        title: "Visão Geral",
        href: "/dashboard/empresa",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: "Funcionários",
        href: "/dashboard/empresa/funcionarios",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Certificados",
        href: "/dashboard/empresa/certificados",
        icon: <Award className="h-5 w-5" />,
      },
      {
        title: "Relatórios",
        href: "/dashboard/empresa/relatorios",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        title: "Cursos",
        href: "/dashboard/empresa/cursos",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "Configurações",
        href: "/dashboard/empresa/configuracoes",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
    admin: [
      {
        title: "Visão Geral",
        href: "/dashboard/admin",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: "Cursos",
        href: "/dashboard/admin/cursos",
        icon: <BookOpen className="h-5 w-5" />,
      },
      {
        title: "Usuários",
        href: "/dashboard/admin/usuarios",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Perfis de Permissão",
        href: "/dashboard/admin/permissoes",
        icon: <Shield className="h-5 w-5" />,
      },
      {
        title: "Clientes",
        href: "/dashboard/admin/clientes",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        title: "Filiais",
        href: "/dashboard/admin/filiais",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        title: "Financeiro",
        href: "/dashboard/admin/financeiro",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        title: "Cupons",
        href: "/dashboard/admin/cupons",
        icon: <Ticket className="h-5 w-5" />,
      },
      {
        title: "Configurações",
        href: "/dashboard/admin/configuracoes",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  };

  const currentNavItems = navItems[userType] || [];
  
  const userTitles: Record<string, { title: string; description?: string }> = {
    aluno: {
      title: "Painel do Aluno",
      description: "Acesse seus cursos e certificados"
    },
    empresa: {
      title: "Painel da Empresa",
      description: "Gerencie funcionários e treinamentos"
    },
    admin: {
      title: "Painel de Administração",
      description: "Administre todos os aspectos da plataforma"
    },
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar para desktop */}
      <aside
        className={cn(
          "hidden md:flex flex-col w-64 border-r transition-all duration-300 bg-sidebar",
          isSidebarOpen ? "md:w-64" : "md:w-20"
        )}
      >
        <div className="p-4 border-b flex items-center justify-between">
          <div
            className={cn(
              "flex items-center",
              isSidebarOpen ? "justify-between w-full" : "justify-center"
            )}
          >
            {isSidebarOpen && (
              <span className="font-bold text-lg">EngeAcademy</span>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="py-4">
            <nav className="space-y-1 px-2">
              {currentNavItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center px-3 py-3 text-sm font-medium rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                    !isSidebarOpen && "justify-center"
                  )}
                >
                  {item.icon}
                  {isSidebarOpen && <span className="ml-3">{item.title}</span>}
                </Link>
              ))}
            </nav>
          </div>
        </ScrollArea>
        
        <div className="border-t p-4">
          <div
            className={cn(
              "flex items-center",
              isSidebarOpen ? "" : "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/avatar.png" />
              <AvatarFallback>
                {user?.name
                  ? user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()
                      .substring(0, 2)
                  : "US"}
              </AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
                <button
                  onClick={logout}
                  className="text-xs text-muted-foreground flex items-center hover:text-primary"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* Sidebar para mobile */}
      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden absolute left-4 top-4 z-10"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64">
          <div className="p-4 border-b flex items-center justify-between">
            <span className="font-bold text-lg">EngeAcademy</span>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <X className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </div>
          
          <ScrollArea className="h-[calc(100vh-8rem)]">
            <div className="py-4">
              <nav className="space-y-1 px-2">
                {currentNavItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-3 text-sm font-medium rounded-md",
                      pathname === item.href
                        ? "bg-sidebar-accent text-sidebar-accent-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
                    )}
                  >
                    {item.icon}
                    <span className="ml-3">{item.title}</span>
                  </Link>
                ))}
              </nav>
            </div>
          </ScrollArea>
          
          <div className="border-t p-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/avatar.png" />
                <AvatarFallback>
                  {user?.name
                    ? user.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()
                        .substring(0, 2)
                    : "US"}
                </AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">{user?.name || "Usuário"}</p>
                <button
                  onClick={logout}
                  className="text-xs text-muted-foreground flex items-center hover:text-primary"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sair
                </button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-6 h-full flex flex-col">
          <DashboardHeader 
            title={userTitles[userType]?.title || "Dashboard"}
            description={userTitles[userType]?.description}
          />
          <main className="flex-1 overflow-auto scroll-smooth">
            <div className="pb-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}