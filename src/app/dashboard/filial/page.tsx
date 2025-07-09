"use client";

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { employees, courses, branches } from "@/lib/mock-data";
import { Award, BookOpen, Briefcase, Building2, CheckCircle, Users } from "lucide-react";
import Link from "next/link";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

export default function FilialDashboard() {
  // Mock: A filial atual é São Paulo
  const currentBranch = "São Paulo";
  
  // Obter detalhes da filial
  const branchDetails = branches.find(b => b.name === currentBranch);
  
  // Filtrar funcionários da filial
  const branchEmployees = employees.filter(emp => emp.branch === currentBranch);
  
  // Estatísticas
  const totalEmployees = branchEmployees.length;
  const totalCourses = branchEmployees.reduce((total, emp) => total + emp.courses.length, 0);
  const completedCourses = branchEmployees.reduce((total, emp) => 
    total + emp.courses.filter(c => c.completed).length, 0
  );
  const inProgressCourses = totalCourses - completedCourses;
  
  // Dados para o gráfico de departamentos
  const departmentsData = branchEmployees.reduce((acc, emp) => {
    if (!acc[emp.department]) {
      acc[emp.department] = {
        name: emp.department,
        value: 0
      };
    }
    acc[emp.department].value += 1;
    return acc;
  }, {} as Record<string, { name: string; value: number }>);
  
  const departmentsChartData = Object.values(departmentsData);
  
  // Cores para o gráfico
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

  return (
    <DashboardLayout userType="filial">
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
                Na filial {currentBranch}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{branchDetails?.courses || 0}</div>
              <p className="text-xs text-muted-foreground">
                Disponíveis para a filial
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Certificações</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                Cursos concluídos
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCourses}</div>
              <p className="text-xs text-muted-foreground">
                Cursos em andamento
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Gráfico de Funcionários por Departamento */}
          <Card>
            <CardHeader>
              <CardTitle>Funcionários por Departamento</CardTitle>
              <CardDescription>
                Distribuição dos funcionários na filial
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentsChartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentsChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Progresso Geral */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Progresso Geral</CardTitle>
                  <CardDescription>
                    Acompanhamento dos treinamentos
                  </CardDescription>
                </div>
                <Link href="/dashboard/filial/progresso">
                  <Button variant="outline">Ver detalhes</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-8">
                <div>
                  <div className="flex justify-between mb-2">
                    <div className="text-sm font-medium">Progresso geral dos cursos</div>
                    <div className="text-sm font-medium">
                      {totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0}%
                    </div>
                  </div>
                  <Progress 
                    value={totalCourses > 0 ? (completedCourses / totalCourses) * 100 : 0} 
                    className="h-2"
                  />
                </div>
                
                {/* Progresso por departamento */}
                {Object.keys(departmentsData).map(dept => {
                  const deptEmployees = branchEmployees.filter(emp => emp.department === dept);
                  const deptTotalCourses = deptEmployees.reduce((total, emp) => total + emp.courses.length, 0);
                  const deptCompletedCourses = deptEmployees.reduce((total, emp) => 
                    total + emp.courses.filter(c => c.completed).length, 0
                  );
                  const deptProgress = deptTotalCourses > 0 ? Math.round((deptCompletedCourses / deptTotalCourses) * 100) : 0;
                  
                  return (
                    <div key={dept}>
                      <div className="flex justify-between mb-2">
                        <div className="text-sm font-medium flex items-center">
                          <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                          {dept}
                        </div>
                        <div className="text-sm font-medium">{deptProgress}%</div>
                      </div>
                      <Progress value={deptProgress} className="h-2" />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Funcionários Recentes */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Funcionários Recentes</CardTitle>
                <CardDescription>
                  Últimos funcionários adicionados à filial
                </CardDescription>
              </div>
              <Link href="/dashboard/filial/funcionarios">
                <Button variant="outline">Ver todos</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {branchEmployees.slice(0, 5).map(employee => {
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
                        <div className="text-sm text-muted-foreground">{employee.department}</div>
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