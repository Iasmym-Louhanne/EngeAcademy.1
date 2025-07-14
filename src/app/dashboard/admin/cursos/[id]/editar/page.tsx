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
import { ChevronLeft, Save } from "lucide-react";
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
  
  const [courseData, setCourseData] = useState<any>({
    tags: [] // Inicializar tags como um array vazio
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
      try {
        const data = await getCourseWithModulesAndLessons(id);
        setCourseData(data);
        setModules(data.modules || []); // Garantir que modules seja um array
      } catch (error) {
        toast.error("Não foi possível carregar os dados do curso.");
        console.error("Erro ao carregar curso:", error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) loadCourse();
  }, [id]);

  const handleSaveCourse = async () => {
    setIsSaving(true);
    try {
      await updateCourse(courseData.id, courseData);
      toast.success("Curso atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar curso.");
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
        const updated = await updateModule(currentModule.id, data);
        setModules(modules.map(m => m.id === updated.id ? { ...m, ...updated } : m));
        toast.success("Módulo atualizado!");
      } else {
        const newModule = await createModule({ ...data, course_id: id, order_index: modules.length });
        setModules([...modules, { ...newModule, lessons: [] }]);
        toast.success("Módulo criado!");
      }
      setDialogState({ ...dialogState, module: false });
    } catch (error) {
      toast.error("Erro ao salvar módulo.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Tem certeza? Isso excluirá todas as aulas e provas do módulo.")) {
      try {
        await deleteModule(moduleId);
        setModules(modules.filter(m => m.id !== moduleId));
        toast.success("Módulo excluído!");
      } catch (error) {
        toast.error("Erro ao excluir módulo.");
      }
    }
  };

  // Lesson handlers
  const handleNewLesson = (moduleId: string) => {
    setCurrentModule(modules.find(m => m.id === moduleId));
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
        const updated = await updateLesson(currentLesson.id, data);
        setModules(modules.map(m => m.id === currentModule.id ? { ...m, lessons: m.lessons.map((l: any) => l.id === updated.id ? updated : l) } : m));
        toast.success("Aula atualizada!");
      } else {
        const newLesson = await createLesson({ ...data, module_id: currentModule.id, order_index: currentModule.lessons?.length || 0 });
        setModules(modules.map(m => m.id === currentModule.id ? { ...m, lessons: [...(m.lessons || []), newLesson] } : m));
        toast.success("Aula criada!");
      }
      setDialogState({ ...dialogState, lesson: false });
    } catch (error) {
      toast.error("Erro ao salvar aula.");
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (confirm("Tem certeza que deseja excluir esta aula?")) {
      try {
        await deleteLesson(lessonId);
        setModules(modules.map(m => m.id === moduleId ? { ...m, lessons: m.lessons.filter((l: any) => l.id !== lessonId) } : m));
        toast.success("Aula excluída!");
      } catch (error) {
        toast.error("Erro ao excluir aula.");
      }
    }
  };

  // Exam handlers
  const handleNewExam = (moduleId: string) => {
    setCurrentModule(modules.find(m => m.id === moduleId));
    setDialogState({ ...dialogState, exam: true });
  };

  const handleSaveExam = async (data: any) => {
    try {
      const newExam = await createExam({ ...data, module_id: currentModule.id });
      toast.success("Prova criada! Redirecionando para edição...");
      router.push(`/dashboard/admin/cursos/${id}/provas/${newExam.id}/editar`);
    } catch (error) {
      toast.error("Erro ao criar prova.");
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
    await reorderModules(updated.map(m => ({ id: m.id, order_index: m.order_index })));
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
    await reorderLessons(updatedLessons.map((l: any) => ({ id: l.id, order_index: l.order_index })));
  };

  const [previewVideo, setPreviewVideo] = useState({ open: false, videoId: "" });
  const handlePreviewVideo = (videoUrl: string) => {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) setPreviewVideo({ open: true, videoId });
    else toast.error("URL de vídeo inválida.");
  };

  if (isLoading) return <DashboardLayout userType="admin"><div>Carregando...</div></DashboardLayout>;

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Link href="/dashboard/admin/cursos" className="text-sm text-muted-foreground hover:text-primary flex items-center"><ChevronLeft className="h-4 w-4 mr-1" />Voltar</Link>
            <h1 className="text-2xl font-bold tracking-tight">Editar Curso</h1>
          </div>
          <Button onClick={handleSaveCourse} disabled={isSaving}>{isSaving ? "Salvando..." : <><Save className="mr-2 h-4 w-4" />Salvar Alterações</>}</Button>
        </div>

        <Tabs defaultValue="info">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">Informações do Curso</TabsTrigger>
            <TabsTrigger value="content">Conteúdo do Curso</TabsTrigger>
          </TabsList>
          <TabsContent value="info" className="mt-6">
            <CourseDetailsForm courseData={courseData} setCourseData={setCourseData} onSave={handleSaveCourse} isSaving={isSaving} />
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

      {dialogState.module && <ModuleDialog isOpen={dialogState.module} onClose={() => setDialogState({ ...dialogState, module: false })} onSave={handleSaveModule} module={currentModule} />}
      {dialogState.lesson && <LessonDialog isOpen={dialogState.lesson} onClose={() => setDialogState({ ...dialogState, lesson: false })} onSave={handleSaveLesson} lesson={currentLesson} />}
      {dialogState.exam && <ExamDialog isOpen={dialogState.exam} onClose={() => setDialogState({ ...dialogState, exam: false })} onSave={handleSaveExam} />}
      
      <Dialog open={previewVideo.open} onOpenChange={(open) => setPreviewVideo({ ...previewVideo, open })}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <div className="aspect-video w-full">{previewVideo.videoId && <YouTubePlayer videoId={previewVideo.videoId} />}</div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  );
}