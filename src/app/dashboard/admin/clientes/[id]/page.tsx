"use client";

import { useState, useEffect } from "react";
import { useParams, notFound } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companies, employees, courses, certificates } from "@/lib/mock-data";
import { Building2, Users, BookOpen, Award, ChevronLeft, FileClock, Repeat } from "lucide-react";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { Progress } from "@/components/ui/progress";

export default function ClienteDetalhePage() {
  const params = useParams();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<any>(null);
  const [companyEmployees, setCompanyEmployees] = useState<any[]>([]);

  useEffect(() => {
    const foundCompany = companies.find(c => c.id === companyId);
    if (foundCompany) {
      setCompany(foundCompany);
      const foundEmployees = employees.filter(e => e.companyId === companyId);
      setCompanyEmployees(foundEmployees);
    }
  }, [companyId]);

  if (!company) {
    return notFound();
  }

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <Link href="/dashboard/admin/clientes" className="flex items-center text-sm text-primary hover:underline">
          <ChevronLeft className="h-4 w-4 mr-1" />
          Voltar para todos os clientes
        </Link>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-4">
              <Building2 className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">{company.name}</CardTitle>
                <CardDescription>CNPJ: {company.cnpj}</CardDescription>
              </div>
              <Badge variant="outline" className={company.billingType === 'recorrente' ? 'text-blue-600 border-blue-200' : 'text-green-600 border-green-200'}>
                {company.billingType === 'recorrente' ? 
                  <Repeat className="mr-1 h-3 w-3" /> : 
                  <FileClock className="mr-1 h-3 w-3" />
                }
                Faturamento {company.billingType === 'recorrente' ? 'Recorrente' : 'Pontual'}
              </Badge>
            </div>
          </CardHeader>
        </Card>

        <Tabs defaultValue="funcionarios">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="funcionarios"><Users className="mr-2 h-4 w-4" />Funcionários</TabsTrigger>
            <TabsTrigger value="cursos"><BookOpen className="mr-2 h-4 w-4" />Cursos</TabsTrigger>
            <TabsTrigger value="certificados"><Award className="mr-2 h-4 w-4" />Certificados</TabsTrigger>
            <TabsTrigger value="faturamento"><FileClock className="mr-2 h-4 w-4" />Faturamento</TabsTrigger>
          </TabsList>

          <TabsContent value="funcionarios">
            <Card>
              <CardHeader>
                <CardTitle>Funcionários de {company.name}</CardTitle>
                <CardDescription>
                  Visualize e gerencie os funcionários vinculados a esta empresa.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollableTable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Progresso Geral</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyEmployees.map(employee => {
                      const totalCourses = employee.courses.length;
                      const completedCount = employee.courses.filter((c: any) => c.completed).length;
                      const progress = totalCourses > 0 ? (completedCount / totalCourses) * 100 : 0;
                      
                      return (
                        <TableRow key={employee.id}>
                          <TableCell className="font-medium">{employee.name}</TableCell>
                          <TableCell>{employee.email}</TableCell>
                          <TableCell>{employee.department}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Progress value={progress} className="h-2 w-24" />
                              <span>{Math.round(progress)}%</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </ScrollableTable>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cursos">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <BookOpen className="mx-auto h-12 w-12 mb-4" />
                <p>Gerenciamento de cursos da empresa em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="certificados">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <Award className="mx-auto h-12 w-12 mb-4" />
                <p>Visualização de certificados da empresa em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="faturamento">
            <Card>
              <CardContent className="pt-6 text-center text-muted-foreground">
                <FileClock className="mx-auto h-12 w-12 mb-4" />
                <p>Histórico de faturamento da empresa em breve.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}