"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { getCourseWithModulesAndLessons, updateCourse, createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson, reorderModules, reorderLessons, extractYouTubeId } from "@/lib/course-service";
import { createExam } from "@/lib/exam-service";
import { toast } from "sonner";
import { ChevronLeft, Save, AlertCircle } from "lucide-react";
import { YouTubePlayer } from "@/components/player/youtube-player";
import { CourseDetailsForm } from "@/components/admin/course-details-form";
import { CourseContentManager } from "@/components/admin/course-content-manager";
import { ModuleDialog } from "@/components/admin/module-dialog";
import { LessonDialog } from "@/components/admin/lesson-dialog";
import { ExamDialog } from "@/components/admin/exam-dialog";

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  
  const [courseData, setCourseData] = useState<any>({
    id: "",
    title: "",
    description: "",
    thumbnail_url: "",
    duration: 0,
    price: 0,
    sale_price: null,
    status: "draft",
    category: "",
    tags: []
  });
  const [modules, setModules] = useState<any[]>([]);
  
  const [dialogState, setDialogState] = useState({
    module: false,
    lesson: false,
    exam: false,
  });
  
  const [currentModule, setCurrentModule] = useState<any>(null);
  const [currentLesson, setCurrentLesson] = useState<any>(null);

  useEffect(() => {
    const loadCourse = async () => {
      if (!id) {
        setLoadError("ID do curso não encontrado");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setLoadError(null);
      
      try {
        console.log("Carregando curso com ID:", id);
        const data = await getCourseWithModulesAndLessons(id);
        console.log("Dados do curso carregados:", data);
        
        setCourseData({
          id: data.id,
          title: data.title || "",
          description: data.description || "",
          thumbnail_url: data.thumbnail_url || "",
          duration: data.duration || 0,
          price: data.price || 0,
          sale_price: data.sale_price || null,
          status: data.status || "draft",
          category: data.category || "",
          tags: data.tags || []
        });
        setModules(data.modules || []);
        
        toast.success("Dados do curso carregados com sucesso!");
      } catch (error: any) {
        console.error("Erro ao carregar curso:", error);
        setLoadError(`Erro ao carregar curso: ${error.message}`);
        toast.error("Não foi possível carregar os dados do curso.");
      } finally {
        setIsLoading(false);
      }
    };
    
    loadCourse();
  }, [id]);

  const handleSaveCourse = async () => {
    if (!courseData.id) {
      toast.error("ID do curso não encontrado");
      return;
    }

    setIsSaving(true);
    try {
      console.log("Salvando curso:", courseData);
      await updateCourse(courseData.id, courseData);
      toast.success("Curso atualizado com sucesso!");
    } catch (error: any) {
      console.error("Erro ao atualizar curso:", error);
      toast.error(`Erro ao atualizar curso: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Module handlers
  const handleNewModule = () => {
    setCurrentModule(null);
    setDialogState({ ...dialogState, module: true });
  };

  const handleEditModule = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    setCurrentModule(module);
    setDialogState({ ...dialogState, module: true });
  };

  const handleSaveModule = async (data: any) => {
    try {
      if (currentModule) {
        console.log("Atualizando módulo:", currentModule.id, data);
        const updated = await updateModule(currentModule.id, data);
        setModules(modules.map(m => m.id === updated.id ? { ...m, ...updated } : m));
        toast.success("Módulo atualizado!");
      } else {
        console.log("Criando novo módulo:", data);
        const newModule = await createModule({ 
          ...data, 
          course_id: id, 
          order_index: modules.length 
        });
        setModules([...modules, { ...newModule, lessons: [] }]);
        toast.success("Módulo criado!");
      }
      setDialogState({ ...dialogState, module: false });
    } catch (error: any) {
      console.error("Erro ao salvar módulo:", error);
      toast.error(`Erro ao salvar módulo: ${error.message}`);
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Tem certeza? Isso excluirá todas as aulas e provas do módulo.")) {
      try {
        await deleteModule(moduleId);
        setModules(modules.filter(m => m.id !== moduleId));
        toast.success("Módulo excluído!");
      } catch (error: any) {
        console.error("Erro ao excluir módulo:", error);
        toast.error(`Erro ao excluir módulo: ${error.message}`);
      }
    }
  };

  // Lesson handlers
  const handleNewLesson = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    setCurrentModule(module);
    setCurrentLesson(null);
    setDialogState({ ...dialogState, lesson: true });
  };

  const handleEditLesson = (moduleId: string, lessonId: string) => {
    const module = modules.find(m => m.id === moduleId);
    const lesson = module?.lessons.find((l: any) => l.id === lessonId);
    setCurrentModule(module);
    setCurrentLesson(lesson);
    setDialogState({ ...dialogState, lesson: true });
  };

  const handleSaveLesson = async (data: any) => {
    try {
      if (currentLesson) {
        console.log("Atualizando aula:", currentLesson.id, data);
        const updated = await updateLesson(currentLesson.id, data);
        setModules(modules.map(m => 
          m.id === currentModule.id 
            ? { ...m, lessons: m.lessons.map((l: any) => l.id === updated.id ? updated : l) } 
            : m
        ));
        toast.success("Aula atualizada!");
      } else {
        console.log("Criando nova aula:", data);
        const newLesson = await createLesson({ 
          ...data, 
          module_id: currentModule.id, 
          order_index: currentModule.lessons?.length || 0 
        });
        setModules(modules.map(m => 
          m.id === currentModule.id 
            ? { ...m, lessons: [...(m.lessons || []), newLesson] } 
            : m
        ));
        toast.success("Aula criada!");
      }
      setDialogState({ ...dialogState, lesson: false });
    } catch (error: any) {
      console.error("Erro ao salvar aula:", error);
      toast.error(`Erro ao salvar aula: ${error.message}`);
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (confirm("Tem certeza que deseja excluir esta aula?")) {
      try {
        await deleteLesson(lessonId);
        setModules(modules.map(m => 
          m.id === moduleId 
            ? { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) } 
            : m
        ));
        toast.success("Aula excluída!");
      } catch (error: any) {
        console.error("Erro ao excluir aula:", error);
        toast.error(`Erro ao excluir aula: ${error.message}`);
      }
    }
  };

  // Exam handlers
  const handleNewExam = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    setCurrentModule(module);
    setDialogState({ ...dialogState, exam: true });
  };

  const handleSaveExam = async (data: any) => {
    try {
      console.log("Criando nova prova:", data);
      const newExam = await createExam({ ...data, module_id: currentModule.id });
      toast.success("Prova criada! Redirecionando para edição...");
      router.push(`/dashboard/admin/cursos/${id}/provas/${newExam.id}/editar`);
    } catch (error: any) {
      console.error("Erro ao criar prova:", error);
      toast.error(`Erro ao criar prova: ${error.message}`);
    }
  };

  // Drag and drop handlers
  const handleReorderModules = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updated = items.map((item, index) => ({ ...item, order_index: index }));
    
    setModules(updated);
    
    try {
      await reorderModules(updated.map(m => ({ id: m.id, order_index: m.order_index })));
    } catch (error: any) {
      console.error("Erro ao reordenar módulos:", error);
      toast.error("Erro ao salvar nova ordem dos módulos");
    }
  };

  const handleReorderLessons = async (moduleId: string, result: any) => {
    if (!result.destination) return;
    
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const items = Array.from(modules[moduleIndex].lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    const updatedLessons = items.map((item: any, index: number) => ({ ...item, order_index: index }));
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedLessons;
    setModules(updatedModules);
    
    try {
      await reorderLessons(updatedLessons.map((l: any) => ({ id: l.id, order_index: l.order_index })));
    } catch (error: any) {
      console.error("Erro ao reordenar aulas:", error);
      toast.error("Erro ao salvar nova ordem das aulas");
    }
  };

  // Video preview
  const [previewVideo, setPreviewVideo] = useState({ open: false, videoId: "" });
  const handlePreviewVideo = (videoUrl: string) => {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      setPreviewVideo({ open: true, videoId });
    } else {
      toast.error("URL de vídeo inválida.");
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados do curso...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Error state
  if (loadError) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Erro ao carregar curso</h3>
            <p className="text-muted-foreground mb-4">{loadError}</p>
            <div className="space-x-2">
              <Button onClick={() => window.location.reload()}>Tentar novamente</Button>
              <Link href="/dashboard/admin/cursos">
                <Button variant="outline">Voltar para cursos</Button>
              </Link>
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link 
              href="/dashboard/admin/cursos" 
              className="text-sm text-muted-foreground hover:text-primary flex items-center"
            >
              <ChevronLeft className="h-4 w-4 mr-1" />
              Voltar para cursos
            </Link>
            <h1 className="text-2xl font-bold tracking-tight mt-2">
              Editar Curso: {courseData.title}
            </h1>
            <p className="text-muted-foreground">
              ID: {courseData.id}
            </p>
          </div>
          <Button onClick={handleSaveCourse} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações do Curso</TabsTrigger>
            <TabsTrigger value="content">Conteúdo do Curso</TabsTrigger>
          </TabsList>
          
          <TabsContent value="info" className="mt-6">
            <CourseDetailsForm 
              courseData={courseData} 
              setCourseData={setCourseData} 
              onSave={handleSaveCourse} 
              isSaving={isSaving} 
            />
          </TabsContent>
          
          <TabsContent value="content" className="mt-6">
            <CourseContentManager
              modules={modules}
              onReorderModules={handleReorderModules}
              onReorderLessons={handleReorderLessons}
              onNewModule={handleNewModule}
              onEditModule={handleEditModule}
              onDeleteModule={handleDeleteModule}
              onNewLesson={handleNewLesson}
              onEditLesson={handleEditLesson}
              onDeleteLesson={handleDeleteLesson}
              onNewExam={handleNewExam}
              onPreviewVideo={handlePreviewVideo}
            />
          </TabsContent>
        </Tabs>
      </div>

      {/* Diálogos */}
      {dialogState.module && (
        <ModuleDialog 
          isOpen={dialogState.module} 
          onClose={() => setDialogState({ ...dialogState, module: false })} 
          onSave={handleSaveModule} 
          module={currentModule} 
        />
      )}
      
      {dialogState.lesson && (
        <LessonDialog 
          isOpen={dialogState.lesson} 
          onClose={() => setDialogState({ ...dialogState, lesson: false })} 
          onSave={handleSaveLesson} 
          lesson={currentLesson} 
        />
      )}
      
      {dialogState.exam && (
        <ExamDialog 
          isOpen={dialogState.exam} 
          onClose={() => setDialogState({ ...dialogState, exam: false })} 
          onSave={handleSaveExam} 
        />
      )}
      
      {/* Preview de vídeo */}
      <Dialog open={previewVideo.open} onOpenChange={(open) => setPreviewVideo({ ...previewVideo, open })}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="aspect-video w-full">
            {previewVideo.videoId && (
              <YouTubePlayer videoId={previewVideo.videoId} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}