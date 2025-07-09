"use client";

import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { CourseCard } from "@/components/dashboard/aluno/course-card";
import { courses, employees } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, CheckCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AlunoDashboard() {
  // Simular que o usuário logado é o primeiro da lista
  const currentUser = employees[0];
  
  // Obter detalhes completos dos cursos do usuário
  const userCourses = currentUser.courses.map(userCourse => {
    const courseDetails = courses.find(c => c.id === userCourse.courseId);
    return {
      ...courseDetails,
      progress: userCourse.progress,
      completed: userCourse.completed
    };
  });

  // Estatísticas
  const totalCourses = userCourses.length;
  const completedCourses = userCourses.filter(c => c.completed).length;
  const inProgressCourses = totalCourses - completedCourses;

  return (
    <DashboardLayout userType="aluno">
      <div className="grid gap-6">
        {/* Estatísticas */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                Cursos disponíveis para você
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Cursos Concluídos</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedCourses}</div>
              <p className="text-xs text-muted-foreground">
                Certificados disponíveis
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Em Progresso</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inProgressCourses}</div>
              <p className="text-xs text-muted-foreground">
                Cursos em andamento
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Cursos */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Meus Cursos</h2>
            <Link href="/dashboard/aluno/todos-cursos">
              <Button variant="outline">Ver todos os cursos</Button>
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {userCourses.map((course) => (
              <CourseCard
                key={course.id}
                id={course.id}
                title={course.title}
                slug={course.slug}
                progress={course.progress}
                duration={course.duration}
                completed={course.completed}
              />
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}