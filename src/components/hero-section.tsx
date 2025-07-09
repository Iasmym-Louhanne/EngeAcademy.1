import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="w-full py-20 md:py-32 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container text-center">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-4">
          Segurança no Trabalho Começa Aqui
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-muted-foreground mb-8">
          Cursos e treinamentos online de SST para capacitar sua equipe e garantir a conformidade da sua empresa.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="#cursos">
            <Button size="lg">Ver Cursos</Button>
          </Link>
          <Link href="/para-empresas">
            <Button size="lg" variant="outline">
              Soluções para Empresas
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}