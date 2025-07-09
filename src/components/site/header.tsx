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
import { Menu, X, ShoppingCart, User, LogIn } from "lucide-react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isLoggedIn = false; // Em uma aplicação real, isso viria de um hook de autenticação

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
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

          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/images/avatar.png" alt="Avatar" />
                    <AvatarFallback>US</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/aluno">Meus Cursos</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/perfil">Meu Perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/auth/logout">Sair</Link>
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
                {isLoggedIn ? (
                  <>
                    <Link href="/dashboard/aluno" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Meus Cursos
                    </Link>
                    <Link href="/perfil" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Meu Perfil
                    </Link>
                    <Link href="/auth/logout" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
                      Sair
                    </Link>
                  </>
                ) : (
                  <Link href="/auth/login" className="text-base font-medium" onClick={() => setIsMenuOpen(false)}>
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