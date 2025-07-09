"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, Building2, BookOpen, Users } from "lucide-react";
import Link from "next/link";

export default function DashboardSelection() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/20">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">EngeAcademy - Dashboard</h1>
          <p className="text-muted-foreground">Selecione o tipo de painel para acessar</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/dashboard/aluno" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="h-5 w-5 mr-2 text-primary" />
                  Painel do Aluno
                </CardTitle>
                <CardDescription>
                  Acesse seus cursos, certificados e progresso
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Acompanhe seu progresso nos cursos</li>
                  <li>Acesse e baixe seus certificados</li>
                  <li>Resgate vouchers e códigos promocionais</li>
                </ul>
                <Button className="w-full mt-4">Acessar como Aluno</Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/empresa" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="h-5 w-5 mr-2 text-primary" />
                  Painel da Empresa
                </CardTitle>
                <CardDescription>
                  Gerencie funcionários, filiais e treinamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Acompanhe o progresso dos funcionários</li>
                  <li>Gerencie certificados e relatórios</li>
                  <li>Adquira novos cursos e vouchers</li>
                </ul>
                <Button className="w-full mt-4">Acessar como Empresa</Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/filial" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2 text-primary" />
                  Painel da Filial
                </CardTitle>
                <CardDescription>
                  Gerencie funcionários locais e treinamentos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Cadastre e gerencie funcionários locais</li>
                  <li>Acompanhe o progresso dos treinamentos</li>
                  <li>Gere relatórios da sua filial</li>
                </ul>
                <Button className="w-full mt-4">Acessar como Filial</Button>
              </CardContent>
            </Card>
          </Link>
          
          <Link href="/dashboard/admin" className="block">
            <Card className="h-full transition-all hover:shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BookOpen className="h-5 w-5 mr-2 text-primary" />
                  Painel de Administração
                </CardTitle>
                <CardDescription>
                  Acesso completo à plataforma
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1">
                  <li>Gerencie empresas, filiais e usuários</li>
                  <li>Crie e configure cursos e produtos</li>
                  <li>Monitore vendas e relatórios financeiros</li>
                </ul>
                <Button className="w-full mt-4">Acessar como Admin</Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </div>
    </div>
  );
}