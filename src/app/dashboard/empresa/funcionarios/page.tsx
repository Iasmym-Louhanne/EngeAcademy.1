"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { employees, companies, branches } from "@/lib/mock-data";
import { Download, FileUp, Plus, Search, Trash2, UserPlus } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { ScrollableTable } from "@/components/ui/scrollable-table";

export default function FuncionariosPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBranch, setSelectedBranch] = useState<string>("all");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    email: "",
    department: "",
    branch: ""
  });

  // Mock: A empresa atual é a primeira da lista
  const currentCompany = companies[0];
  
  // Filtrar funcionários da empresa (em uma app real seria pelo ID da empresa)
  let filteredEmployees = employees.filter(emp => 
    currentCompany.branches.includes(emp.branch)
  );
  
  // Aplicar filtros de busca e filial
  if (searchTerm) {
    filteredEmployees = filteredEmployees.filter(emp => 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.department.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  if (selectedBranch !== "all") {
    filteredEmployees = filteredEmployees.filter(emp => emp.branch === selectedBranch);
  }

  const handleAddEmployee = () => {
    // Validação simples
    if (!newEmployee.name || !newEmployee.email || !newEmployee.department || !newEmployee.branch) {
      toast.error("Por favor, preencha todos os campos");
      return;
    }
    
    // Em uma aplicação real, enviaríamos para a API
    toast.success(`Funcionário ${newEmployee.name} adicionado com sucesso!`);
    
    // Limpar o formulário
    setNewEmployee({
      name: "",
      email: "",
      department: "",
      branch: ""
    });
  };

  const handleImportEmployees = () => {
    toast.success("Modelo de importação baixado. Complete-o e faça upload para importar funcionários.");
  };

  return (
    <DashboardLayout userType="empresa">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Funcionários</h2>
          <div className="flex gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Adicionar Funcionário
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Novo Funcionário</DialogTitle>
                  <DialogDescription>
                    Preencha os dados do funcionário para adicioná-lo ao sistema.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <label htmlFor="name">Nome completo</label>
                    <Input
                      id="name"
                      value={newEmployee.name}
                      onChange={(e) => setNewEmployee({...newEmployee, name: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <Input
                      id="email"
                      type="email"
                      value={newEmployee.email}
                      onChange={(e) => setNewEmployee({...newEmployee, email: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="department">Departamento</label>
                    <Input
                      id="department"
                      value={newEmployee.department}
                      onChange={(e) => setNewEmployee({...newEmployee, department: e.target.value})}
                    />
                  </div>
                  <div className="grid gap-2">
                    <label htmlFor="branch">Filial</label>
                    <Select
                      value={newEmployee.branch}
                      onValueChange={(value) => setNewEmployee({...newEmployee, branch: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a filial" />
                      </SelectTrigger>
                      <SelectContent>
                        {currentCompany.branches.map((branch) => (
                          <SelectItem key={branch} value={branch}>
                            {branch}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleAddEmployee}>Adicionar Funcionário</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <FileUp className="mr-2 h-4 w-4" />
                  Importar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Importar Funcionários</DialogTitle>
                  <DialogDescription>
                    Faça upload de uma planilha CSV ou Excel com os dados dos funcionários.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <Button variant="outline" onClick={handleImportEmployees}>
                    <Download className="mr-2 h-4 w-4" />
                    Baixar modelo
                  </Button>
                  <div className="border-2 border-dashed rounded-md p-6 text-center">
                    <div className="mt-2">
                      <input
                        id="file-upload"
                        name="file-upload"
                        type="file"
                        className="sr-only"
                      />
                      <label
                        htmlFor="file-upload"
                        className="cursor-pointer text-primary hover:text-primary/80"
                      >
                        <span>Clique para fazer upload</span>
                        <span className="text-muted-foreground"> ou arraste e solte</span>
                      </label>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      CSV, XLS ou XLSX até 10MB
                    </p>
                  </div>
                </div>
                <DialogFooter>
                  <Button>Importar Funcionários</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar funcionários..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="w-full md:w-48">
                <Select value={selectedBranch} onValueChange={setSelectedBranch}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filial" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todas as Filiais</SelectItem>
                    {currentCompany.branches.map((branch) => (
                      <SelectItem key={branch} value={branch}>
                        {branch}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollableTable maxHeight="60vh" stickyHeader>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Departamento</TableHead>
                  <TableHead>Filial</TableHead>
                  <TableHead>Progresso</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmployees.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4">
                      Nenhum funcionário encontrado
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmployees.map((employee) => {
                    const totalCourses = employee.courses.length;
                    const completedCount = employee.courses.filter(c => c.completed).length;
                    const progressPercentage = totalCourses > 0 
                      ? Math.round((completedCount / totalCourses) * 100) 
                      : 0;
                    
                    return (
                      <TableRow key={employee.id}>
                        <TableCell className="font-medium">{employee.name}</TableCell>
                        <TableCell>{employee.email}</TableCell>
                        <TableCell>{employee.department}</TableCell>
                        <TableCell>{employee.branch}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={progressPercentage} className="h-2 w-full max-w-24" />
                            <span className="text-sm w-12">{progressPercentage}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </ScrollableTable>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}