"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { 
  Menu, 
  X, 
  ShoppingCart, 
  User, 
  LogIn, 
  LogOut, 
  LayoutDashboard, 
  Settings
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { user, profile, logout } = useAuth();

  // Mapear o tipo de usuário para o caminho do dashboard
  const getDashboardPath = () => {
    if (!user) return "/auth/login";
    
    const pathByRole: Record<string, string> = {
      admin: '/dashboard/admin',
      supervisor: '/dashboard/empresa',
      commercial: '/dashboard/empresa',
      support: '/dashboard/admin',
    };
    return pathByRole[user.profileId || ''] ?? '/dashboard/aluno';
  };

  // Obter as iniciais do nome do usuário para o avatar
  const getInitials = () => {
    if (!profile?.full_name) return "?";
    return profile.full_name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">EngeAcademy</span>
          </Link>
        </div>

        {/* Navigation for desktop */}
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/cursos" className="text-sm font-medium hover:text-primary">
            Cursos
          </Link>
          <Link href="/sobre" className="text-sm font-medium hover:text-primary">
            Sobre nós
          </Link>
          <Link href="/empresas" className="text-sm font-medium hover:text-primary">
            Para Empresas
          </Link>
          <Link href="/contato" className="text-sm font-medium hover:text-primary">
            Contato
          </Link>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center gap-2">
          <Link href="/carrinho">
            <Button variant="ghost" size="icon">
              <ShoppingCart className="h-5 w-5" />
              <span className="sr-only">Carrinho</span>
            </Button>
          </Link>

          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} alt={profile?.full_name || "Avatar"} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">{profile?.full_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href={getDashboardPath()} className="cursor-pointer">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Meu Painel</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil" className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Configurações</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Link href="/auth/login">
              <Button variant="default">
                <LogIn className="mr-2 h-4 w-4" />
                Entrar
              </Button>
            </Link>
          )}

          {/* Mobile menu button */}
          <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[240px] sm:w-[300px]">
              <div className="flex items-center justify-between mb-6">
                <Link href="/" className="flex items-center" onClick={() => setIsMenuOpen(false)}>
                  <span className="text-xl font-bold">EngeAcademy</span>
                </Link>
                <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                  <X className="h-5 w-5" />
                  <span className="sr-only">Fechar</span>
                </Button>
              </div>
              {user && (
                <div className="flex flex-col space-y-1 mb-6 pb-6 border-b">
                  <p className="font-medium">{profile?.full_name}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
              )}
              <nav className="flex flex-col gap-4">
                <Link href="/cursos" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Cursos
                </Link>
                <Link href="/sobre" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Sobre nós
                </Link>
                <Link href="/empresas" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Para Empresas
                </Link>
                <Link href="/contato" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                  Contato
                </Link>
                {user ? (
                  <>
                    <Link href={getDashboardPath()} className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Meu Painel
                    </Link>
                    <Link href="/perfil" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Configurações
                    </Link>
                    <button 
                      onClick={() => { 
                        logout(); 
                        setIsMenuOpen(false); 
                      }} 
                      className="text-base font-medium text-left flex items-center gap-2 text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Sair
                    </button>
                  </>
                ) : (
                  <Link href="/auth/login" className="text-base font-medium flex items-center gap-2" onClick={() => setIsMenuOpen(false)}>
                    <LogIn className="h-4 w-4" />
                    Entrar
                  </Link>
                )}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}