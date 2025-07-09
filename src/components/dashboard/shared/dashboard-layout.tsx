"use client";

import { useState, ReactNode } from "react";
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
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

type NavItem = {
  title: string;
  href: string;
  icon: ReactNode;
};

type DashboardLayoutProps = {
  children: ReactNode;
  userType: "aluno" | "empresa" | "filial" | "admin";
};

export function DashboardLayout({ children, userType }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

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
    filial: [
      {
        title: "Visão Geral",
        href: "/dashboard/filial",
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
      {
        title: "Funcionários",
        href: "/dashboard/filial/funcionarios",
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: "Progresso",
        href: "/dashboard/filial/progresso",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        title: "Relatórios",
        href: "/dashboard/filial/relatorios",
        icon: <FileText className="h-5 w-5" />,
      },
      {
        title: "Configurações",
        href: "/dashboard/filial/configuracoes",
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
        title: "Empresas",
        href: "/dashboard/admin/empresas",
        icon: <Building2 className="h-5 w-5" />,
      },
      {
        title: "Financeiro",
        href: "/dashboard/admin/financeiro",
        icon: <BarChart3 className="h-5 w-5" />,
      },
      {
        title: "Configurações",
        href: "/dashboard/admin/configuracoes",
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  };

  const currentNavItems = navItems[userType] || [];
  
  const userTitles = {
    aluno: "Painel do Aluno",
    empresa: "Painel da Empresa",
    filial: "Painel da Filial",
    admin: "Painel de Administração",
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
        <div className="flex-1 overflow-y-auto py-4">
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
        <div className="border-t p-4">
          <div
            className={cn(
              "flex items-center",
              isSidebarOpen ? "" : "justify-center"
            )}
          >
            <Avatar className="h-8 w-8">
              <AvatarImage src="/images/avatar.png" />
              <AvatarFallback>US</AvatarFallback>
            </Avatar>
            {isSidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium">Usuário</p>
                <Link
                  href="/auth/logout"
                  className="text-xs text-muted-foreground flex items-center hover:text-primary"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sair
                </Link>
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
          <div className="border-t p-4">
            <div className="flex items-center">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/images/avatar.png" />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Usuário</p>
                <Link
                  href="/auth/logout"
                  className="text-xs text-muted-foreground flex items-center hover:text-primary"
                >
                  <LogOut className="h-3 w-3 mr-1" />
                  Sair
                </Link>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Conteúdo principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-background border-b h-16 flex items-center px-6">
          <div className="flex-1">
            <h1 className="text-2xl font-bold">{userTitles[userType]}</h1>
          </div>
        </header>
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}