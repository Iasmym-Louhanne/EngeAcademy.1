"use client";

import { useState } from "react";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { courses as initialCourses } from "@/lib/mock-data";
import { Plus, Search, Edit, Trash2, BookOpen } from "lucide-react";
import { ScrollableTable } from "@/components/ui/scrollable-table";
import Link from "next/link";
import { toast } from "sonner";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState(initialCourses);
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteCourse = (courseId: string) => {
    if (confirm("Tem certeza que deseja excluir este curso? Esta ação não pode ser desfeita.")) {
      setCourses(prev => prev.filter(c => c.id !== courseId));
      toast.success("Curso excluído com sucesso!");
    }
  };

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold flex items-center">
            <BookOpen className="mr-2 h-6 w-6 text-primary" />
            Gerenciamento de Cursos
          </h2>
          <Link href="/dashboard/admin/cursos/novo">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Curso
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <div className="flex justify-between">
              <div>
                <CardTitle>Lista de Cursos</CardTitle>
                <CardDescription>Crie, edite e gerencie todos os cursos da plataforma.</CardDescription>
              </div>
              <div className="w-72">
                <Input
                  placeholder="Buscar por nome do curso..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                  icon={<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollableTable>
              <TableHeader>
                <TableRow>
                  <TableHead>Título do Curso</TableHead>
                  <TableHead>Duração</TableHead>
                  <TableHead>Preço</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCourses.map(course => (
                  <TableRow key={course.id}>
                    <TableCell className="font-medium">{course.title}</TableCell>
                    <TableCell>{course.duration}</TableCell>
                    <TableCell>R$ {course.price?.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={course.featured ? "default" : "outline"}>
                        {course.featured ? "Ativo" : "Inativo"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/dashboard/admin/cursos/${course.id}`}>
                        <Button variant="ghost" size="icon">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCourse(course.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </ScrollableTable>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}