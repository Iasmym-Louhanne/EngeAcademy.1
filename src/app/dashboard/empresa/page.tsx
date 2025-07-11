"use client";

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { employees, courses, branches, companies } from "@/lib/mock-data";
import { BarChart, BarChart3, Building2, CheckCircle, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { BarChart as Chart } from "recharts";
import { Bar, BarChart as RechartsBarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function EmpresaDashboard() {
  // Mock: A empresa atual é a primeira da lista
  const currentCompany = companies[0];
  
  // Filtrar funcionários da empresa (em uma app real seria pelo ID da empresa)
  const companyEmployees = employees.filter(emp => 
    currentCompany.branches.includes(emp.branch)
  );
  
  // Estatísticas
  const totalEmployees = companyEmployees.length;
  const activeCourses = currentCompany.activeCourses;
  const completedCourses = companyEmployees.reduce((total, emp) => 
    total + emp.courses.filter(c => c.completed).length, 0
  );
  const inProgressCourses = companyEmployees.reduce((total, emp) => 
    total + emp.courses.filter(c => !c.completed).length, 0
  );
  
  // Dados para o gráfico de progresso por filial
  const branchData = currentCompany.branches.map(branchName => {
    const branchEmployees = companyEmployees.filter(emp => emp.branch === branchName);
    const totalCourses = branchEmployees.reduce((total, emp) => total + emp.courses.length, 0);
    const completed = branchEmployees.reduce((total, emp) => 
      total + emp.courses.filter(c => c.completed).length, 0
    );
    
    return {
      name: branchName,
      total: totalCourses,
      completed: completed,
      progress: totalCourses > 0 ? Math.round((completed / totalCourses) * 100) : 0
    };
  });

  return (
    <DashboardLayout userType="empresa">
      <div className="grid gap-6">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Funcionários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Cadastrados no sistema
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Filiais</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{currentCompany.branches.length}</div>
              <p className="text-xs text-muted-foreground">
                Unidades ativas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{activeCourses}</div>
              <p className="text-xs text-muted-foreground">
                Em todas as filiais
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Certificações</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                Cursos concluídos
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Progresso por Filial */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Progresso por Filial</CardTitle>
            <CardDescription>
              Visão geral do progresso dos cursos em cada filial
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                  data={branchData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Cursos Concluídos" fill="#4f46e5" />
                  <Bar dataKey="total" name="Total de Cursos" fill="#e5e7eb" />
                </RechartsBarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Progresso dos funcionários */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Progresso dos Funcionários</CardTitle>
                <CardDescription>
                  Os 5 funcionários mais recentes
                </CardDescription>
              </div>
              <Link href="/dashboard/empresa/funcionarios">
                <Button variant="outline">Ver todos</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {companyEmployees.slice(0, 5).map(employee => {
                const totalCourses = employee.courses.length;
                const completedCount = employee.courses.filter(c => c.completed).length;
                const progressPercentage = totalCourses > 0 
                  ? Math.round((completedCount / totalCourses) * 100) 
                  : 0;
                
                return (
                  <div key={employee.id} className="space-y-2">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-medium">{employee.name}</div>
                        <div className="text-sm text-muted-foreground">{employee.branch} - {employee.department}</div>
                      </div>
                      <div className="text-sm font-medium">{progressPercentage}%</div>
                    </div>
                    <Progress value={progressPercentage} className="h-2" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}