"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { companies as initialCompanies, branches } from "@/lib/mock-data";
import { Building2, Search, User, Users, Plus, FileClock, Repeat } from "lucide-react";
import Link from "next/link";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import { toast } from "sonner";

export default function ClientesPage() {
  const [companies, setCompanies] = useState(initialCompanies);
  const [searchTerm, setSearchTerm] = useState("");
  const [branchFilter, setBranchFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCompany, setNewCompany] = useState({
    name: "",
    cnpj: "",
    billingType: "pontual" as "recorrente" | "pontual",
    branchId: ""
  });

  const handleAddCompany = () => {
    if (!newCompany.name || !newCompany.cnpj) {
      toast.error("Nome e CNPJ são obrigatórios.");
      return;
    }
    const newCompanyData = {
      ...newCompany,
      id: `comp-${Date.now()}`,
      totalEmployees: 0,
      activeCourses: 0,
      branches: [],
      logo: ''
    };
    setCompanies(prev => [newCompanyData, ...prev]);
    setIsModalOpen(false);
    setNewCompany({ name: "", cnpj: "", billingType: "pontual", branchId: "" });
    toast.success("Empresa adicionada com sucesso!");
  };

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          company.cnpj.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBranch = branchFilter === "all" ||
                          (branchFilter === "unassigned" && !company.branchId) ||
                          company.branchId === branchFilter;
    return matchesSearch && matchesBranch;
  });

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Gerenciamento de Clientes
          </h2>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Empresa
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Nova Empresa</DialogTitle>
                <DialogDescription>Preencha os dados da nova empresa cliente.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nome da Empresa</Label>
                  <Input id="name" value={newCompany.name} onChange={e => setNewCompany({...newCompany, name: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cnpj">CNPJ</Label>
                  <Input id="cnpj" value={newCompany.cnpj} onChange={e => setNewCompany({...newCompany, cnpj: e.target.value})} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="billingType">Tipo de Faturamento</Label>
                  <Select value={newCompany.billingType} onValueChange={value => setNewCompany({...newCompany, billingType: value as any})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pontual">Pontual</SelectItem>
                      <SelectItem value="recorrente">Recorrente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="branchId">Filial Associada (EngeAcademy)</Label>
                  <Select value={newCompany.branchId} onValueChange={value => setNewCompany({...newCompany, branchId: value})}>
                    <SelectTrigger><SelectValue placeholder="Selecione uma filial" /></SelectTrigger>
                    <SelectContent>
                      {branches.map(branch => (
                        <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
                <Button onClick={handleAddCompany}>Salvar Empresa</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <Tabs defaultValue="empresas">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="empresas"><Building2 className="mr-2 h-4 w-4" />Empresas</TabsTrigger>
            <TabsTrigger value="individuais"><User className="mr-2 h-4 w-4" />Clientes Finais</TabsTrigger>
          </TabsList>
          
          <TabsContent value="empresas">
            <Card>
              <CardHeader>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <CardTitle>Clientes Corporativos</CardTitle>
                    <CardDescription>Gerencie as empresas parceiras da EngeAcademy.</CardDescription>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
                    <Input
                      placeholder="Buscar por nome ou CNPJ..."
                      className="pl-8 w-full md:w-64"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      icon={<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />}
                    />
                    <Select value={branchFilter} onValueChange={setBranchFilter}>
                      <SelectTrigger className="w-full md:w-56"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas as Filiais</SelectItem>
                        <SelectItem value="unassigned">Sem Filial</SelectItem>
                        {branches.map(branch => (
                          <SelectItem key={branch.id} value={branch.id}>{branch.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollableTable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>Filial Associada</TableHead>
                      <TableHead>Funcionários</TableHead>
                      <TableHead>Faturamento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map(company => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{branches.find(b => b.id === company.branchId)?.name || 'N/A'}</TableCell>
                        <TableCell>{company.totalEmployees}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={company.billingType === 'recorrente' ? 'text-blue-600 border-blue-200' : 'text-green-600 border-green-200'}>
                            {company.billingType === 'recorrente' ? <Repeat className="mr-1 h-3 w-3" /> : <FileClock className="mr-1 h-3 w-3" />}
                            {company.billingType === 'recorrente' ? 'Recorrente' : 'Pontual'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/admin/clientes/${company.id}`}>
                            <Button variant="outline" size="sm">Gerenciar</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </ScrollableTable>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="individuais">
            <Card>
              <CardHeader>
                <CardTitle>Clientes Individuais (CPF)</CardTitle>
                <CardDescription>Gerencie os clientes que compram cursos para si mesmos.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12 text-muted-foreground">
                  <User className="mx-auto h-12 w-12 mb-4" />
                  <p>A funcionalidade de gerenciamento de clientes individuais será implementada em breve.</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}