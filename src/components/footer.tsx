import Link from "next/link";
import { BookOpen } from "lucide-react";
import { MadeWithLasy } from "./made-with-lasy";

export function Footer() {
  return (
    <footer className="border-t bg-muted/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <BookOpen className="h-6 w-6" />
              <span className="font-bold text-lg">EngeAcademy</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Capacitando profissionais para um ambiente de trabalho mais seguro.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Cursos</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/cursos?category=NR" className="hover:underline">Normas Regulamentadoras</Link>
              <Link href="/cursos?category=CIPA" className="hover:underline">CIPA</Link>
              <Link href="/cursos?category=Primeiros+Socorros" className="hover:underline">Primeiros Socorros</Link>
              <Link href="/cursos" className="hover:underline">Todos os Cursos</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Institucional</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/sobre" className="hover:underline">Sobre Nós</Link>
              <Link href="/para-empresas" className="hover:underline">Para Empresas</Link>
              <Link href="/contato" className="hover:underline">Contato</Link>
            </nav>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <nav className="flex flex-col gap-2 text-sm">
              <Link href="/termos" className="hover:underline">Termos de Serviço</Link>
              <Link href="/privacidade" className="hover:underline">Política de Privacidade</Link>
            </nav>
          </div>
        </div>
        <div className="mt-8 border-t pt-6 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} EngeAcademy. Todos os direitos reservados.</p>
          <MadeWithLasy />
        </div>
      </div>
    </footer>
  );
}