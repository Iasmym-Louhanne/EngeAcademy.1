"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, BookOpen, ListOrdered, FileQuestion } from "lucide-react";
import { courses as initialCourses } from "@/lib/mock-data";
import { CourseDetailsForm } from "@/components/admin/course-details-form";
import { CourseModuleList } from "@/components/admin/course-module-list";
import { CourseQuizSettings } from "@/components/admin/course-quiz-settings";
import { toast } from "sonner";

// Mock de estrutura de curso
const courseStructureMock = {
  'nr35': {
    modules: [
      { id: 'mod1', title: 'Módulo 1: Introdução e Normas', order: 1, lessons: [
        { id: 'les1', title: 'O que é a NR 35?', videoId: 'dQw4w9WgXcQ', order: 1 },
        { id: 'les2', title: 'Responsabilidades', videoId: 'L_jWHffIx5E', order: 2 },
      ]},
      { id: 'mod2', title: 'Módulo 2: Equipamentos', order: 2, lessons: [
        { id: 'les3', title: 'Equipamentos de Proteção (EPI)', videoId: '3tmd-ClpJxA', order: 1 },
      ]},
    ]
  }
};

export default function CourseEditPage() {
  const router = useRouter();
  const params = useParams();
  const courseId = params.id as string;
  const isNewCourse = courseId === "novo";

  const [course, setCourse] = useState<any>(null);
  const [modules, setModules] = useState<any[]>([]);

  useEffect(() => {
    if (!isNewCourse) {
      const foundCourse = initialCourses.find(c => c.id === courseId);
      setCourse(foundCourse);
      // @ts-ignore
      setModules(courseStructureMock[courseId]?.modules || []);
    } else {
      setCourse({
        title: "",
        description: "",
        duration: "",
        price: 0,
        passingGrade: 70,
        featured: true,
      });
      setModules([]);
    }
  }, [courseId, isNewCourse]);

  const handleSaveCourse = () => {
    // Lógica para salvar o curso (mock)
    toast.success(`Curso "${course.title}" salvo com sucesso!`);
    router.push("/dashboard/admin/cursos");
  };

  if (!course) {
    return (
      <DashboardLayout userType="admin">
        <div>Carregando...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="grid gap-6">
        <div>
          <Link href="/dashboard/admin/cursos" className="flex items-center text-sm text-primary hover:underline mb-4">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para todos os cursos
          </Link>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">{isNewCourse ? "Criar Novo Curso" : `Editando: ${course.title}`}</h2>
              <p className="text-muted-foreground">Preencha todos os detalhes do curso abaixo.</p>
            </div>
            <Button onClick={handleSaveCourse}>Salvar Curso</Button>
          </div>
        </div>

        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details"><BookOpen className="mr-2 h-4 w-4" />Detalhes</TabsTrigger>
            <TabsTrigger value="modules"><ListOrdered className="mr-2 h-4 w-4" />Módulos e Aulas</TabsTrigger>
            <TabsTrigger value="quiz"><FileQuestion className="mr-2 h-4 w-4" />Prova</TabsTrigger>
          </TabsList>

          <TabsContent value="details">
            <CourseDetailsForm course={course} setCourse={setCourse} />
          </TabsContent>
          <TabsContent value="modules">
            <CourseModuleList modules={modules} setModules={setModules} />
          </TabsContent>
          <TabsContent value="quiz">
            <CourseQuizSettings course={course} setCourse={setCourse} />
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}