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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { companies, employees as initialEmployees, courses, certificates, branches } from "@/lib/mock-data";
import { Building2, Users, BookOpen, Award, ChevronLeft, FileClock, Repeat, Plus, FileUp, Download, KeyRound, CheckCircle, Hourglass } from "lucide-react";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function ClienteDetalhePage() {
  const params = useParams();
  const companyId = params.id as string;
  
  const [company, setCompany] = useState<any>(null);
  const [companyEmployees, setCompanyEmployees] = useState<any[]>([]);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployee, setNewEmployee] = useState({ name: "", email: "", department: "" });

  useEffect(() => {
    const foundCompany = companies.find(c => c.id === companyId);
    if (foundCompany) {
      setCompany(foundCompany);
      const foundEmployees = initialEmployees.filter(e => e.companyId === companyId);
      setCompanyEmployees(foundEmployees);
    }
  }, [companyId]);

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.email) {
      toast.error("Nome e email são obrigatórios.");
      return;
    }
    const employeeData = {
      ...newEmployee,
      id: `emp-${Date.now()}`,
      companyId: company.id,
      status: 'pending',
      courses: []
    };
    setCompanyEmployees(prev => [employeeData, ...prev]);
    setIsAddEmployeeModalOpen(false);
    setNewEmployee({ name: "", email: "", department: "" });
    toast.success("Funcionário adicionado. Gere o acesso para ativar.");
  };

  const handleGenerateAccess = (employeeId: string) => {
    const promise = new Promise((resolve) => setTimeout(resolve, 2000));
    toast.promise(promise, {
      loading: 'Gerando credenciais de acesso...',
      success: () => {
        setCompanyEmployees(prev => prev.map(emp => 
          emp.id === employeeId ? { ...emp, status: 'active' } : emp
        ));
        return 'Acesso gerado e enviado para o funcionário!';
      },
      error: 'Erro ao gerar acesso.',
    });
  };

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
            <div className="flex flex-wrap items-center gap-4">
              <Building2 className="h-10 w-10 text-primary" />
              <div>
                <CardTitle className="text-2xl">{company.name}</CardTitle>
                <CardDescription>CNPJ: {company.cnpj}</CardDescription>
              </div>
              <Badge variant="outline" className="text-sm">
                Filial: {branches.find(b => b.id === company.branchId)?.name || 'Não associada'}
              </Badge>
              <Badge variant="outline" className={company.billingType === 'recorrente' ? 'text-blue-600 border-blue-200' : 'text-green-600 border-green-200'}>
                {company.billingType === 'recorrente' ? <Repeat className="mr-1 h-3 w-3" /> : <FileClock className="mr-1 h-3 w-3" />}
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
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                  <div>
                    <CardTitle>Funcionários de {company.name}</CardTitle>
                    <CardDescription>Visualize e gerencie os funcionários da empresa.</CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Dialog open={isAddEmployeeModalOpen} onOpenChange={setIsAddEmployeeModalOpen}>
                      <DialogTrigger asChild><Button><Plus className="mr-2 h-4 w-4" />Adicionar</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Adicionar Funcionário</DialogTitle></DialogHeader>
                        <div className="grid gap-4 py-4">
                          <div className="space-y-2"><Label htmlFor="name">Nome</Label><Input id="name" value={newEmployee.name} onChange={e => setNewEmployee({...newEmployee, name: e.target.value})} /></div>
                          <div className="space-y-2"><Label htmlFor="email">Email</Label><Input id="email" type="email" value={newEmployee.email} onChange={e => setNewEmployee({...newEmployee, email: e.target.value})} /></div>
                          <div className="space-y-2"><Label htmlFor="department">Departamento</Label><Input id="department" value={newEmployee.department} onChange={e => setNewEmployee({...newEmployee, department: e.target.value})} /></div>
                        </div>
                        <DialogFooter><Button onClick={handleAddEmployee}>Salvar</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild><Button variant="outline"><FileUp className="mr-2 h-4 w-4" />Importar</Button></DialogTrigger>
                      <DialogContent>
                        <DialogHeader><DialogTitle>Importar Funcionários</DialogTitle></DialogHeader>
                        <div className="py-4 space-y-4">
                          <p>Baixe o modelo, preencha e importe para adicionar múltiplos funcionários de uma vez.</p>
                          <Button variant="outline" className="w-full"><Download className="mr-2 h-4 w-4" />Baixar Modelo CSV</Button>
                          <div className="border-2 border-dashed rounded-md p-6 text-center cursor-pointer hover:border-primary">
                            <p>Arraste e solte o arquivo aqui ou clique para selecionar</p>
                          </div>
                        </div>
                        <DialogFooter><Button>Importar Arquivo</Button></DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollableTable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {companyEmployees.map(employee => (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}<div className="text-sm text-muted-foreground">{employee.email}</div></TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>
                          <Badge variant={employee.status === 'active' ? 'success' : 'secondary'}>
                            {employee.status === 'active' ? <CheckCircle className="mr-1 h-3 w-3" /> : <Hourglass className="mr-1 h-3 w-3" />}
                            {employee.status === 'active' ? 'Ativo' : 'Acesso Pendente'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          {employee.status === 'pending' && (
                            <Button size="sm" onClick={() => handleGenerateAccess(employee.id)}>
                              <KeyRound className="mr-2 h-4 w-4" />
                              Gerar Acesso
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ScrollableTable>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cursos"><Card><CardContent className="pt-6 text-center text-muted-foreground"><BookOpen className="mx-auto h-12 w-12 mb-4" /><p>Gerenciamento de cursos da empresa em breve.</p></CardContent></Card></TabsContent>
          <TabsContent value="certificados"><Card><CardContent className="pt-6 text-center text-muted-foreground"><Award className="mx-auto h-12 w-12 mb-4" /><p>Visualização de certificados da empresa em breve.</p></CardContent></Card></TabsContent>
          <TabsContent value="faturamento"><Card><CardContent className="pt-6 text-center text-muted-foreground"><FileClock className="mx-auto h-12 w-12 mb-4" /><p>Histórico de faturamento da empresa em breve.</p></CardContent></Card></TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}