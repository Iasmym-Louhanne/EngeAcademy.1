"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BarChart3, Users, Award } from "lucide-react";
import Link from "next/link";

export default function EmpresasPage() {
  return (
    <div className="bg-background text-foreground">
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-muted/30">
        <div className="container px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-4">
            Capacitação Corporativa Simplificada
          </h1>
          <p className="max-w-3xl mx-auto text-lg text-muted-foreground mb-8">
            A EngeAcademy oferece uma solução completa para gerenciar os treinamentos de segurança da sua equipe, garantindo conformidade e produtividade.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/contato">
              <Button size="lg">Fale com um Especialista</Button>
            </Link>
            <Link href="/auth/login">
              <Button size="lg" variant="outline">
                Acessar Painel da Empresa
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Tudo que sua Empresa Precisa em um Só Lugar</h2>
            <p className="text-muted-foreground mt-2">
              Ferramentas poderosas para otimizar a gestão de treinamentos.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Gestão de Funcionários</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Cadastre, importe e gerencie todos os seus colaboradores em uma interface intuitiva. Atribua cursos e acompanhe o progresso individualmente.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <BarChart3 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Relatórios Completos</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Acesse relatórios detalhados sobre o progresso dos treinamentos, certificados emitidos e conformidade da equipe. Exporte dados em PDF ou CSV.
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Award className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle>Controle de Certificados</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Monitore a validade dos certificados de toda a equipe, receba alertas de vencimento e garanta que sua empresa esteja sempre em conformidade.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section className="py-16 bg-muted/30">
        <div className="container px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Comece em 3 Passos Simples</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">1</div>
              <h3 className="text-xl font-semibold mb-2">Entre em Contato</h3>
              <p className="text-muted-foreground">
                Nossos especialistas entendem suas necessidades e configuram o plano ideal para sua empresa.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">2</div>
              <h3 className="text-xl font-semibold mb-2">Cadastre sua Equipe</h3>
              <p className="text-muted-foreground">
                Adicione seus colaboradores manualmente ou importe uma lista completa de forma rápida e fácil.
              </p>
            </div>
            <div className="flex flex-col items-center">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary text-primary-foreground font-bold text-2xl mb-4">3</div>
              <h3 className="text-xl font-semibold mb-2">Acompanhe o Progresso</h3>
              <p className="text-muted-foreground">
                Utilize o painel administrativo para monitorar o avanço dos treinamentos e gerenciar os certificados.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Pronto para Elevar a Segurança da sua Empresa?</h2>
          <p className="max-w-2xl mx-auto text-muted-foreground mb-8">
            Deixe-nos ajudar a construir um ambiente de trabalho mais seguro e produtivo.
          </p>
          <Link href="/contato">
            <Button size="lg">Solicitar uma Demonstração</Button>
          </Link>
        </div>
      </section>
    </div>
  );
}