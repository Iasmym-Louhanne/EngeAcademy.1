"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { companies } from "@/lib/mock-data";
import { Building2, Search, User, Plus, FileClock, Repeat } from "lucide-react";
import Link from "next/link";
import { ScrollableTable } from "@/components/ui/scrollable-table";

export default function ClientesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompanies = companies.filter(company =>
    company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    company.cnpj.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold flex items-center">
            <Users className="mr-2 h-6 w-6 text-primary" />
            Gerenciamento de Clientes
          </h2>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Cliente
          </Button>
        </div>

        <Tabs defaultValue="empresas">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="empresas">
              <Building2 className="mr-2 h-4 w-4" />
              Empresas
            </TabsTrigger>
            <TabsTrigger value="individuais">
              <User className="mr-2 h-4 w-4" />
              Clientes Finais
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="empresas">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <div>
                    <CardTitle>Clientes Corporativos</CardTitle>
                    <CardDescription>
                      Gerencie as empresas parceiras da EngeAcademy.
                    </CardDescription>
                  </div>
                  <div className="w-72">
                    <div className="relative">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por nome ou CNPJ..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <ScrollableTable>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Empresa</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Funcionários</TableHead>
                      <TableHead>Faturamento</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCompanies.map(company => (
                      <TableRow key={company.id}>
                        <TableCell className="font-medium">{company.name}</TableCell>
                        <TableCell>{company.cnpj}</TableCell>
                        <TableCell>{company.totalEmployees}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className={company.billingType === 'recorrente' ? 'text-blue-600 border-blue-200' : 'text-green-600 border-green-200'}>
                            {company.billingType === 'recorrente' ? 
                              <Repeat className="mr-1 h-3 w-3" /> : 
                              <FileClock className="mr-1 h-3 w-3" />
                            }
                            {company.billingType === 'recorrente' ? 'Recorrente' : 'Pontual'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/dashboard/admin/clientes/${company.id}`}>
                            <Button variant="outline" size="sm">
                              Gerenciar
                            </Button>
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
                <CardDescription>
                  Gerencie os clientes que compram cursos para si mesmos.
                </CardDescription>
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