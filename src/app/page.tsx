import { MadeWithLasy } from "@/components/made-with-lasy";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
        <h1 className="text-4xl font-bold mb-4">EngeAcademy - Plataforma de Treinamentos</h1>
        <p className="text-xl text-gray-600 mb-6">
          Transformando conhecimento em segurança!
        </p>

        <div className="flex flex-col sm:flex-row gap-4">
          <Link href="/dashboard">
            <Button size="lg">
              Acessar Dashboards
            </Button>
          </Link>
          <Link href="/treinamento/nr-35-trabalho-em-altura">
            <Button variant="outline" size="lg">
              Acessar Exemplo de Curso
            </Button>
          </Link>
        </div>
      </main>
      <MadeWithLasy />
    </div>
  );
}