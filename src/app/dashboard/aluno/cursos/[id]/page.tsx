"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { extractYouTubeId, getCourseWithModulesAndLessons } from "@/lib/course-service";
import { YouTubePlayer } from "@/components/player/youtube-player";
import { toast } from "sonner";
import { ChevronLeft, Clock, FileText, Play, CheckCircle, LockIcon, Award } from "lucide-react";
import Link from "next/link";

export default function StudentCoursePage() {
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [course, setCourse] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseData = await getCourseWithModulesAndLessons(id);
        setCourse(courseData);
        
        // Definir a primeira aula como atual (em situação real, recuperaríamos o progresso do aluno)
        if (courseData.modules.length > 0 && courseData.modules[0].lessons.length > 0) {
          setCurrentLesson(courseData.modules[0].lessons[0]);
        }
        
        // Mock de aulas completas
        const mockCompletedLessons: string[] = [];
        let totalLessons = 0;
        
        courseData.modules.forEach((module: any) => {
          totalLessons += module.lessons.length;
          if (module.lessons.length > 0) {
            // Marcar algumas aulas aleatoriamente como completas para demonstração
            module.lessons.forEach((lesson: any, index: number) => {
              if (Math.random() > 0.6) {
                mockCompletedLessons.push(lesson.id);
              }
            });
          }
        });
        
        setCompletedLessons(mockCompletedLessons);
        setProgress(Math.round((mockCompletedLessons.length / totalLessons) * 100));
        
      } catch (error) {
        console.error("Erro ao carregar curso:", error);
        toast.error("Não foi possível carregar os dados do curso.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id) {
      loadCourse();
    }
  }, [id]);

  const handleLessonClick = (lesson: any) => {
    setCurrentLesson(lesson);
  };

  const markLessonAsCompleted = (lessonId: string) => {
    if (!completedLessons.includes(lessonId)) {
      const updatedCompletedLessons = [...completedLessons, lessonId];
      setCompletedLessons(updatedCompletedLessons);
      
      // Recalcular progresso
      let totalLessons = 0;
      course.modules.forEach((module: any) => {
        totalLessons += module.lessons.length;
      });
      
      setProgress(Math.round((updatedCompletedLessons.length / totalLessons) * 100));
      
      toast.success("Aula marcada como concluída!");
    }
  };

  const handleVideoEnd = () => {
    if (currentLesson) {
      markLessonAsCompleted(currentLesson.id);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="aluno">
        <div className="flex justify-center items-center h-full py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando curso...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (!course) {
    return (
      <DashboardLayout userType="aluno">
        <div className="text-center py-12">
          <p className="text-lg font-medium">Curso não encontrado</p>
          <Link href="/dashboard/aluno">
            <Button variant="link" className="mt-4">
              <ChevronLeft className="mr-2 h-4 w-4" />
              Voltar para meus cursos
            </Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="aluno">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Área principal - player e detalhes da aula */}
        <div className="flex-1 order-2 lg:order-1">
          <div className="mb-6">
            <Link href="/dashboard/aluno" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
              <ChevronLeft className="mr-1 h-4 w-4" />
              Voltar para meus cursos
            </Link>
            <h1 className="text-2xl font-bold mt-2">{course.title}</h1>
            <div className="flex items-center gap-2 mt-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{course.duration} minutos de conteúdo</span>
              <span className="mx-2">•</span>
              <span>Progresso: {progress}%</span>
            </div>
            <Progress value={progress} className="mt-2 h-2" />
          </div>

          <Card className="mb-6">
            <CardContent className="p-0">
              {currentLesson ? (
                <div>
                  <div className="aspect-video w-full bg-black">
                    {currentLesson.video_url && (
                      <YouTubePlayer 
                        videoId={extractYouTubeId(currentLesson.video_url) || ""} 
                        onVideoEnd={handleVideoEnd}
                      />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h2 className="text-xl font-bold">{currentLesson.title}</h2>
                        <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{currentLesson.duration} minutos</span>
                        </div>
                      </div>
                      {completedLessons.includes(currentLesson.id) ? (
                        <Badge variant="success" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Concluída
                        </Badge>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => markLessonAsCompleted(currentLesson.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar como concluída
                        </Button>
                      )}
                    </div>
                    {currentLesson.description && (
                      <div className="mt-4">
                        <h3 className="text-sm font-medium mb-2">Descrição da aula</h3>
                        <p className="text-muted-foreground">{currentLesson.description}</p>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="p-12 text-center">
                  <p className="text-muted-foreground">Selecione uma aula para começar</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Tabs defaultValue="conteudo">
            <TabsList>
              <TabsTrigger value="conteudo">Conteúdo do Curso</TabsTrigger>
              <TabsTrigger value="sobre">Sobre o Curso</TabsTrigger>
            </TabsList>
            <TabsContent value="conteudo">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Módulos e Aulas</h2>
                  <Accordion type="multiple" defaultValue={["module-0"]}>
                    {course.modules.map((module: any, moduleIndex: number) => (
                      <AccordionItem key={module.id} value={`module-${moduleIndex}`}>
                        <AccordionTrigger>
                          <div className="flex items-center gap-2">
                            <span>Módulo {moduleIndex + 1}: {module.title}</span>
                            <Badge variant="outline" className="ml-2">
                              {module.lessons.length} {module.lessons.length === 1 ? "aula" : "aulas"}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="space-y-2 pl-4">
                            {module.lessons.map((lesson: any, lessonIndex: number) => (
                              <div
                                key={lesson.id}
                                className={`flex items-center p-2 rounded-md cursor-pointer hover:bg-muted ${
                                  currentLesson?.id === lesson.id ? "bg-muted" : ""
                                }`}
                                onClick={() => handleLessonClick(lesson)}
                              >
                                <div className="flex-1 flex items-center gap-3">
                                  {completedLessons.includes(lesson.id) ? (
                                    <CheckCircle className="h-5 w-5 text-primary" />
                                  ) : (
                                    <Play className="h-5 w-5 text-muted-foreground" />
                                  )}
                                  <div>
                                    <div className="font-medium">{moduleIndex + 1}.{lessonIndex + 1} {lesson.title}</div>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                      <Clock className="h-3 w-3" />
                                      <span>{lesson.duration} minutos</span>
                                    </div>
                                  </div>
                                </div>
                                {lesson.is_free && (
                                  <Badge variant="success" className="ml-2">Grátis</Badge>
                                )}
                              </div>
                            ))}
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="sobre">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Sobre este Curso</h2>
                  <div className="prose dark:prose-invert max-w-none">
                    <p>{course.description}</p>
                    <h3 className="text-lg font-medium mt-6 mb-2">O que você aprenderá</h3>
                    <ul className="mt-2 space-y-1">
                      <li>Item de aprendizado 1</li>
                      <li>Item de aprendizado 2</li>
                      <li>Item de aprendizado 3</li>
                    </ul>
                    <h3 className="text-lg font-medium mt-6 mb-2">Requisitos</h3>
                    <ul className="mt-2 space-y-1">
                      <li>Não são necessários conhecimentos prévios</li>
                    </ul>
                    <h3 className="text-lg font-medium mt-6 mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {course.tags && course.tags.map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary">{tag}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Barra lateral - progresso e estrutura do curso */}
        <div className="w-full lg:w-80 order-1 lg:order-2">
          <Card>
            <CardContent className="p-4">
              <div className="text-center p-4">
                <div className="inline-flex items-center justify-center rounded-full bg-primary/10 p-3 mb-3">
                  <Award className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Progresso do Curso</h3>
                <div className="mt-2 text-2xl font-bold">{progress}%</div>
                <Progress value={progress} className="mt-2" />
                
                <div className="mt-4 text-sm text-muted-foreground">
                  {completedLessons.length} de {course.modules.reduce((total: number, module: any) => total + module.lessons.length, 0)} aulas concluídas
                </div>
                
                <Button className="w-full mt-4">
                  {progress === 100 ? (
                    <>
                      <Award className="mr-2 h-4 w-4" />
                      Ver Certificado
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Ir para Avaliação Final
                    </>
                  )}
                </Button>
              </div>
              
              <div className="border-t mt-4 pt-4">
                <h4 className="font-medium mb-2">Conteúdo do Curso</h4>
                <ScrollArea className="h-[calc(100vh-400px)]">
                  <div className="space-y-1 pr-2">
                    {course.modules.map((module: any, moduleIndex: number) => (
                      <div key={module.id} className="mb-3">
                        <div className="font-medium text-sm">{moduleIndex + 1}. {module.title}</div>
                        <div className="mt-1 pl-4 space-y-1">
                          {module.lessons.map((lesson: any, lessonIndex: number) => (
                            <div
                              key={lesson.id}
                              className={`flex items-center py-1 px-2 text-sm rounded-md cursor-pointer hover:bg-muted ${
                                currentLesson?.id === lesson.id ? "bg-muted" : ""
                              }`}
                              onClick={() => handleLessonClick(lesson)}
                            >
                              <div className="mr-2 flex-shrink-0">
                                {completedLessons.includes(lesson.id) ? (
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                ) : (
                                  <Play className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>
                              <span className="truncate">{moduleIndex + 1}.{lessonIndex + 1} {lesson.title}</span>
                            </div>
                          ))}
                          <div className="mt-2 pl-6">
                            <div className="flex items-center text-sm text-muted-foreground">
                              <LockIcon className="h-4 w-4 mr-2" />
                              <span>Avaliação do Módulo</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    <div className="pt-2">
                      <div className="flex items-center py-1 px-2 text-sm font-medium">
                        <LockIcon className="h-4 w-4 mr-2" />
                        <span>Avaliação Final do Curso</span>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}