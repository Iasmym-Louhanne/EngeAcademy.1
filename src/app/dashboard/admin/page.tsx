"use client";

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { courses, employees, companies, branches, salesData } from "@/lib/mock-data";
import { BookOpen, Building2, DollarSign, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from "recharts";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function AdminDashboard() {
  const [timeframe, setTimeframe] = useState("month");
  
  // Estatísticas
  const totalCompanies = companies.length;
  const totalBranches = branches.length;
  const totalEmployees = employees.length;
  const totalCourses = courses.length;
  
  // Total de vendas
  const totalRevenue = salesData.reduce((total, data) => total + data.revenue, 0);
  
  // Top empresas por funcionários
  const topCompaniesByEmployees = [...companies]
    .sort((a, b) => b.totalEmployees - a.totalEmployees)
    .slice(0, 5);
  
  // Top cursos vendidos (mock)
  const topCoursesSold = [
    { id: 'nr35', name: 'NR 35', sales: 125 },
    { id: 'nr33', name: 'NR 33', sales: 98 },
    { id: 'nr10', name: 'NR 10', sales: 87 },
    { id: 'primeiros-socorros', name: 'Primeiros Socorros', sales: 72 }
  ];
  
  // Dados de vendas por filial (mock)
  const salesByBranch = branches.map(branch => ({
    name: branch.name,
    vendas: Math.floor(Math.random() * 50000) + 10000
  }));

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Empresas</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCompanies}</div>
              <p className="text-xs text-muted-foreground">
                {totalBranches} filiais registradas
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Usuários</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEmployees}</div>
              <p className="text-xs text-muted-foreground">
                Alunos na plataforma
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Ativos na plataforma
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Vendas</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R$ {totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                Total acumulado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Vendas */}
        <Card>
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle>Receita ao Longo do Tempo</CardTitle>
                <CardDescription>
                  Acompanhamento das vendas da plataforma
                </CardDescription>
              </div>
              <div className="flex items-center">
                <select
                  className="w-32 rounded-md border border-input px-3 py-1 text-sm shadow-sm"
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                >
                  <option value="week">Esta Semana</option>
                  <option value="month">Este Mês</option>
                  <option value="year">Este Ano</option>
                </select>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={salesData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`R$ ${value}`, 'Receita']} />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    fill="#8884d8"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Top Empresas */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Empresas</CardTitle>
                  <CardDescription>
                    Por número de funcionários
                  </CardDescription>
                </div>
                <Link href="/dashboard/admin/empresas">
                  <Button variant="outline">Ver todas</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empresa</TableHead>
                    <TableHead>Filiais</TableHead>
                    <TableHead className="text-right">Funcionários</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topCompaniesByEmployees.map((company) => (
                    <TableRow key={company.id}>
                      <TableCell className="font-medium">{company.name}</TableCell>
                      <TableCell>{company.branches.length}</TableCell>
                      <TableCell className="text-right">{company.totalEmployees}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Top Cursos */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Top Cursos</CardTitle>
                  <CardDescription>
                    Cursos mais vendidos
                  </CardDescription>
                </div>
                <Link href="/dashboard/admin/cursos">
                  <Button variant="outline">Ver todos</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topCoursesSold}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="name" type="category" />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="sales" name="Vendas" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Últimas Transações */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Últimas Transações</CardTitle>
                <CardDescription>
                  Compras recentes na plataforma
                </CardDescription>
              </div>
              <Link href="/dashboard/admin/financeiro">
                <Button variant="outline">Ver todas</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Produto</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Valor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">#TRX-1234</TableCell>
                  <TableCell>Construções ABC</TableCell>
                  <TableCell>Pacote 50 licenças NR 35</TableCell>
                  <TableCell>12/07/2023</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Pago
                    </span>
                  </TableCell>
                  <TableCell className="text-right">R$ 4.500,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#TRX-1235</TableCell>
                  <TableCell>Indústria XYZ</TableCell>
                  <TableCell>Pacote 20 licenças NR 33</TableCell>
                  <TableCell>10/07/2023</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                      Pago
                    </span>
                  </TableCell>
                  <TableCell className="text-right">R$ 2.800,00</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">#TRX-1236</TableCell>
                  <TableCell>Construções ABC</TableCell>
                  <TableCell>Pacote 10 licenças NR 10</TableCell>
                  <TableCell>05/07/2023</TableCell>
                  <TableCell>
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                      Pendente
                    </span>
                  </TableCell>
                  <TableCell className="text-right">R$ 1.500,00</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}