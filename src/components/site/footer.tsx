import Link from "next/link";
import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-muted">
      <div className="container py-12 md:py-16 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">EngeAcademy</h3>
            <p className="text-muted-foreground text-sm">
              Transformando conhecimento em segurança através de treinamentos especializados para empresas e profissionais.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </Link>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Cursos</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/cursos/nr-35-trabalho-em-altura" className="text-sm text-muted-foreground hover:text-primary">
                  NR 35 - Trabalho em Altura
                </Link>
              </li>
              <li>
                <Link href="/cursos/nr-33-espacos-confinados" className="text-sm text-muted-foreground hover:text-primary">
                  NR 33 - Espaços Confinados
                </Link>
              </li>
              <li>
                <Link href="/cursos/nr-10-seguranca-eletrica" className="text-sm text-muted-foreground hover:text-primary">
                  NR 10 - Segurança em Instalações Elétricas
                </Link>
              </li>
              <li>
                <Link href="/cursos/primeiros-socorros" className="text-sm text-muted-foreground hover:text-primary">
                  Primeiros Socorros
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Empresa</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/sobre" className="text-sm text-muted-foreground hover:text-primary">
                  Sobre nós
                </Link>
              </li>
              <li>
                <Link href="/empresas" className="text-sm text-muted-foreground hover:text-primary">
                  Para Empresas
                </Link>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-muted-foreground hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/contato" className="text-sm text-muted-foreground hover:text-primary">
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/termos" className="text-sm text-muted-foreground hover:text-primary">
                  Termos de Uso
                </Link>
              </li>
              <li>
                <Link href="/privacidade" className="text-sm text-muted-foreground hover:text-primary">
                  Política de Privacidade
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-sm text-muted-foreground hover:text-primary">
                  Política de Cookies
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t mt-12 pt-6 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} EngeAcademy. Todos os direitos reservados.
          </p>
          <p className="text-sm text-muted-foreground mt-2 sm:mt-0">
            <Link href="/termos" className="hover:text-primary">Termos</Link> • 
            <Link href="/privacidade" className="hover:text-primary ml-2">Privacidade</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}