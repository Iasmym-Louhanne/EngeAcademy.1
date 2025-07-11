import { Button } from "@/components/ui/button";
import Link from "next/link";

export function HeroSection() {
  return (
    <div className="relative">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950/20 dark:to-blue-900/20" />
      
      {/* Content */}
      <div className="container relative py-20 md:py-32 px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tighter mb-6">
              Treinamentos Especializados em Saúde e Segurança do Trabalho
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Capacite sua equipe com cursos atualizados que atendem às normas
              regulamentadoras. Certificações reconhecidas e plataforma online
              adaptada às necessidades da sua empresa.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/cursos">
                <Button size="lg">
                  Ver Cursos
                </Button>
              </Link>
              <Link href="/empresas">
                <Button variant="outline" size="lg">
                  Soluções para Empresas
                </Button>
              </Link>
            </div>
          </div>
          
          {/* Image or illustration would go here */}
          <div className="bg-muted rounded-lg p-8 hidden md:block">
            <div className="aspect-video bg-primary/10 rounded-md flex items-center justify-center">
              <p className="text-primary font-semibold">Imagem Ilustrativa</p>
            </div>
          </div>
        </div>
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 text-center">
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <p className="text-3xl font-bold">2000+</p>
            <p className="text-muted-foreground">Alunos Certificados</p>
          </div>
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <p className="text-3xl font-bold">50+</p>
            <p className="text-muted-foreground">Empresas Parceiras</p>
          </div>
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <p className="text-3xl font-bold">12+</p>
            <p className="text-muted-foreground">Cursos Especializados</p>
          </div>
          <div className="bg-background rounded-lg p-6 shadow-sm">
            <p className="text-3xl font-bold">98%</p>
            <p className="text-muted-foreground">Satisfação dos Clientes</p>
          </div>
        </div>
      </div>
    </div>
  );
}