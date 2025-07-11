"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ReportGenerator } from "@/components/reports/report-generator";
import { useAuth } from "@/contexts/auth-context";
import { BarChart, Users, Award, BookOpen, Building } from "lucide-react";
import { employees, certificates, companies, branches } from "@/lib/mock-data";

export default function RelatoriosPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("funcionarios");
  
  // Filtrar dados com base na organização do usuário
  const filteredEmployees = user?.organizationType === 'filial_empresa'
    ? employees.filter(emp => emp.branch === user.organizationName)
    : employees;
  
  // Definição das colunas para cada tipo de relatório
  const employeeColumns = [
    { field: 'name', header: 'Nome' },
    { field: 'email', header: 'Email' },
    { field: 'department', header: 'Departamento' },
    { field: 'branch', header: 'Filial' }
  ];
  
  const certificateColumns = [
    { field: 'id', header: 'ID' },
    { field: 'courseId', header: 'Curso' },
    { field: 'issueDate', header: 'Data de Emissão' },
    { field: 'expiryDate', header: 'Data de Validade' },
    { field: 'authCode', header: 'Código de Autenticação' }
  ];
  
  // Preparar dados para relatórios
  const certificatesWithNames = certificates.map(cert => {
    const employee = employees.find(emp => emp.id === cert.employeeId);
    return {
      ...cert,
      employeeName: employee?.name || 'Desconhecido'
    };
  });
  
  // Relatório de progresso
  const progressData = employees.map(emp => {
    const totalCourses = emp.courses.length;
    const completedCourses = emp.courses.filter(c => c.completed).length;
    const progressPercent = totalCourses > 0 
      ? Math.round((completedCourses / totalCourses) * 100) 
      : 0;
    
    return {
      id: emp.id,
      name: emp.name,
      department: emp.department,
      branch: emp.branch,
      totalCourses,
      completedCourses,
      progressPercent: `${progressPercent}%`,
      status: progressPercent === 100 
        ? 'Concluído' 
        : progressPercent > 0 
          ? 'Em andamento' 
          : 'Não iniciado'
    };
  });
  
  const progressColumns = [
    { field: 'name', header: 'Funcionário' },
    { field: 'department', header: 'Departamento' },
    { field: 'branch', header: 'Filial' },
    { field: 'totalCourses', header: 'Total de Cursos' },
    { field: 'completedCourses', header: 'Cursos Concluídos' },
    { field: 'progressPercent', header: 'Progresso' },
    { field: 'status', header: 'Status' }
  ];
  
  return (
    <DashboardLayout userType={user?.role === 'filial' ? 'filial' : 'empresa'}>
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <BarChart className="mr-2 h-6 w-6 text-primary" />
              Relatórios
            </h2>
            <p className="text-muted-foreground">
              Gere relatórios personalizados sobre funcionários, certificados e progresso.
            </p>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-6">
            <TabsTrigger value="funcionarios" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>Funcionários</span>
            </TabsTrigger>
            <TabsTrigger value="certificados" className="flex items-center gap-2">
              <Award className="h-4 w-4" />
              <span>Certificados</span>
            </TabsTrigger>
            <TabsTrigger value="progresso" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <span>Progresso</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="funcionarios">
            <ReportGenerator
              title="Relatório de Funcionários"
              description="Lista completa de funcionários da empresa"
              data={filteredEmployees}
              columns={employeeColumns}
              defaultSortField="name"
            />
          </TabsContent>
          
          <TabsContent value="certificados">
            <ReportGenerator
              title="Relatório de Certificados"
              description="Certificados emitidos para funcionários"
              data={certificatesWithNames}
              columns={[
                { field: 'employeeName', header: 'Funcionário' },
                ...certificateColumns
              ]}
              defaultSortField="issueDate"
              defaultSortDirection="desc"
            />
          </TabsContent>
          
          <TabsContent value="progresso">
            <ReportGenerator
              title="Relatório de Progresso"
              description="Acompanhamento do progresso dos funcionários nos cursos"
              data={progressData}
              columns={progressColumns}
              defaultSortField="progressPercent"
              defaultSortDirection="desc"
            />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}