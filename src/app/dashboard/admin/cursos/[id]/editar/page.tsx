"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getCourseWithModulesAndLessons, updateCourse, createModule, updateModule, deleteModule, createLesson, updateLesson, deleteLesson, reorderModules, reorderLessons, extractYouTubeId } from "@/lib/course-service";
import { createExam, deleteExam, updateExam } from "@/lib/exam-service";
import { toast } from "sonner";
import { ChevronLeft, Pencil, Plus, Save, Trash2, FilePlus, FileVideo, GripVertical, X, YouTube, FileText, SquareCheckbox } from "lucide-react";
import Image from "next/image";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { YouTubePlayer } from "@/components/player/youtube-player";

export default function EditCoursePage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dados do curso
  const [courseData, setCourseData] = useState({
    id: "",
    title: "",
    description: "",
    thumbnail_url: "",
    duration: 0,
    price: 0,
    sale_price: null as number | null,
    status: "draft" as "draft" | "published" | "archived",
    category: "",
    tags: [] as string[]
  });
  
  // Módulos e aulas
  const [modules, setModules] = useState<any[]>([]);
  
  // Estado para tags
  const [tagInput, setTagInput] = useState("");
  
  // Estados para diálogos
  const [newModuleDialogOpen, setNewModuleDialogOpen] = useState(false);
  const [editModuleDialogOpen, setEditModuleDialogOpen] = useState(false);
  const [newLessonDialogOpen, setNewLessonDialogOpen] = useState(false);
  const [editLessonDialogOpen, setEditLessonDialogOpen] = useState(false);
  const [newExamDialogOpen, setNewExamDialogOpen] = useState(false);
  
  // Estados para edição de módulo
  const [currentModuleId, setCurrentModuleId] = useState<string | null>(null);
  const [moduleFormData, setModuleFormData] = useState({
    title: "",
    description: ""
  });
  
  // Estados para edição de aula
  const [currentModuleForLesson, setCurrentModuleForLesson] = useState<string | null>(null);
  const [currentLessonId, setCurrentLessonId] = useState<string | null>(null);
  const [lessonFormData, setLessonFormData] = useState({
    title: "",
    description: "",
    video_url: "",
    duration: 0,
    is_free: false
  });
  
  // Estados para exame
  const [examFormData, setExamFormData] = useState({
    title: "",
    description: "",
    passing_score: 70,
    time_limit: 30,
    attempts_allowed: 3
  });
  
  // Estado para visualização de vídeo
  const [previewVideo, setPreviewVideo] = useState({
    open: false,
    videoId: ""
  });

  // Carregar dados do curso
  useEffect(() => {
    const loadCourse = async () => {
      try {
        const courseWithModulesAndLessons = await getCourseWithModulesAndLessons(id);
        
        setCourseData({
          id: courseWithModulesAndLessons.id,
          title: courseWithModulesAndLessons.title,
          description: courseWithModulesAndLessons.description,
          thumbnail_url: courseWithModulesAndLessons.thumbnail_url,
          duration: courseWithModulesAndLessons.duration,
          price: courseWithModulesAndLessons.price,
          sale_price: courseWithModulesAndLessons.sale_price,
          status: courseWithModulesAndLessons.status,
          category: courseWithModulesAndLessons.category,
          tags: courseWithModulesAndLessons.tags || []
        });
        
        setModules(courseWithModulesAndLessons.modules);
        
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  const handleNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value);
    setCourseData({ ...courseData, [name]: isNaN(numericValue) ? 0 : numericValue });
  };

  const addTag = () => {
    if (tagInput.trim() && !courseData.tags.includes(tagInput.trim())) {
      setCourseData({
        ...courseData,
        tags: [...courseData.tags, tagInput.trim()]
      });
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setCourseData({
      ...courseData,
      tags: courseData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSaveCourse = async () => {
    setIsSaving(true);
    
    try {
      await updateCourse(courseData.id, courseData);
      toast.success("Curso atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      toast.error("Erro ao atualizar curso. Verifique os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Módulos
  const openNewModuleDialog = () => {
    setModuleFormData({
      title: "",
      description: ""
    });
    setNewModuleDialogOpen(true);
  };

  const openEditModuleDialog = (moduleId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      setCurrentModuleId(moduleId);
      setModuleFormData({
        title: module.title,
        description: module.description
      });
      setEditModuleDialogOpen(true);
    }
  };

  const handleCreateModule = async () => {
    try {
      const newModule = await createModule({
        course_id: courseData.id,
        title: moduleFormData.title,
        description: moduleFormData.description,
        order_index: modules.length
      });
      
      setModules([...modules, { ...newModule, lessons: [] }]);
      toast.success("Módulo criado com sucesso!");
      setNewModuleDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar módulo:", error);
      toast.error("Erro ao criar módulo. Verifique os dados e tente novamente.");
    }
  };

  const handleUpdateModule = async () => {
    if (!currentModuleId) return;
    
    try {
      const updatedModule = await updateModule(currentModuleId, {
        title: moduleFormData.title,
        description: moduleFormData.description
      });
      
      setModules(modules.map(module => 
        module.id === currentModuleId 
          ? { ...module, title: updatedModule.title, description: updatedModule.description } 
          : module
      ));
      
      toast.success("Módulo atualizado com sucesso!");
      setEditModuleDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar módulo:", error);
      toast.error("Erro ao atualizar módulo. Verifique os dados e tente novamente.");
    }
  };

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm("Tem certeza que deseja excluir este módulo? Todas as aulas e provas serão excluídas permanentemente.")) {
      try {
        await deleteModule(moduleId);
        setModules(modules.filter(module => module.id !== moduleId));
        toast.success("Módulo excluído com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir módulo:", error);
        toast.error("Erro ao excluir módulo. Tente novamente mais tarde.");
      }
    }
  };

  // Aulas
  const openNewLessonDialog = (moduleId: string) => {
    setCurrentModuleForLesson(moduleId);
    setLessonFormData({
      title: "",
      description: "",
      video_url: "",
      duration: 0,
      is_free: false
    });
    setNewLessonDialogOpen(true);
  };

  const openEditLessonDialog = (moduleId: string, lessonId: string) => {
    const module = modules.find(m => m.id === moduleId);
    if (module) {
      const lesson = module.lessons.find((l: any) => l.id === lessonId);
      if (lesson) {
        setCurrentModuleForLesson(moduleId);
        setCurrentLessonId(lessonId);
        setLessonFormData({
          title: lesson.title,
          description: lesson.description,
          video_url: lesson.video_url,
          duration: lesson.duration,
          is_free: lesson.is_free
        });
        setEditLessonDialogOpen(true);
      }
    }
  };

  const handleCreateLesson = async () => {
    if (!currentModuleForLesson) return;
    
    try {
      const moduleIndex = modules.findIndex(m => m.id === currentModuleForLesson);
      if (moduleIndex === -1) return;
      
      const newLesson = await createLesson({
        module_id: currentModuleForLesson,
        title: lessonFormData.title,
        description: lessonFormData.description,
        video_url: lessonFormData.video_url,
        duration: lessonFormData.duration,
        is_free: lessonFormData.is_free,
        order_index: modules[moduleIndex].lessons?.length || 0
      });
      
      const updatedModules = [...modules];
      if (!updatedModules[moduleIndex].lessons) {
        updatedModules[moduleIndex].lessons = [];
      }
      updatedModules[moduleIndex].lessons.push(newLesson);
      
      setModules(updatedModules);
      toast.success("Aula criada com sucesso!");
      setNewLessonDialogOpen(false);
    } catch (error) {
      console.error("Erro ao criar aula:", error);
      toast.error("Erro ao criar aula. Verifique os dados e tente novamente.");
    }
  };

  const handleUpdateLesson = async () => {
    if (!currentModuleForLesson || !currentLessonId) return;
    
    try {
      const updatedLesson = await updateLesson(currentLessonId, {
        title: lessonFormData.title,
        description: lessonFormData.description,
        video_url: lessonFormData.video_url,
        duration: lessonFormData.duration,
        is_free: lessonFormData.is_free
      });
      
      const updatedModules = modules.map(module => {
        if (module.id === currentModuleForLesson) {
          return {
            ...module,
            lessons: module.lessons.map((lesson: any) => 
              lesson.id === currentLessonId ? updatedLesson : lesson
            )
          };
        }
        return module;
      });
      
      setModules(updatedModules);
      toast.success("Aula atualizada com sucesso!");
      setEditLessonDialogOpen(false);
    } catch (error) {
      console.error("Erro ao atualizar aula:", error);
      toast.error("Erro ao atualizar aula. Verifique os dados e tente novamente.");
    }
  };

  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (confirm("Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.")) {
      try {
        await deleteLesson(lessonId);
        
        const updatedModules = modules.map(module => {
          if (module.id === moduleId) {
            return {
              ...module,
              lessons: module.lessons.filter((lesson: any) => lesson.id !== lessonId)
            };
          }
          return module;
        });
        
        setModules(updatedModules);
        toast.success("Aula excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir aula:", error);
        toast.error("Erro ao excluir aula. Tente novamente mais tarde.");
      }
    }
  };

  // Prova
  const openNewExamDialog = (moduleId: string) => {
    setCurrentModuleForLesson(moduleId);
    setExamFormData({
      title: "",
      description: "",
      passing_score: 70,
      time_limit: 30,
      attempts_allowed: 3
    });
    setNewExamDialogOpen(true);
  };

  const handleCreateExam = async () => {
    if (!currentModuleForLesson) return;
    
    try {
      const newExam = await createExam({
        module_id: currentModuleForLesson,
        title: examFormData.title,
        description: examFormData.description,
        passing_score: examFormData.passing_score,
        time_limit: examFormData.time_limit,
        attempts_allowed: examFormData.attempts_allowed
      });
      
      toast.success("Prova criada com sucesso!");
      router.push(`/dashboard/admin/cursos/${courseData.id}/provas/${newExam.id}/editar`);
    } catch (error) {
      console.error("Erro ao criar prova:", error);
      toast.error("Erro ao criar prova. Verifique os dados e tente novamente.");
    }
  };

  // Arrastar e soltar para reordenar módulos
  const handleDragEndModules = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Atualizar a ordem localmente
    const updatedModules = items.map((item, index) => ({
      ...item,
      order_index: index
    }));
    
    setModules(updatedModules);
    
    // Atualizar a ordem no banco de dados
    try {
      await reorderModules(updatedModules.map(m => ({ id: m.id, order_index: m.order_index })));
    } catch (error) {
      console.error("Erro ao reordenar módulos:", error);
      toast.error("Erro ao salvar a nova ordem dos módulos.");
    }
  };

  // Arrastar e soltar para reordenar aulas
  const handleDragEndLessons = async (moduleId: string, result: any) => {
    if (!result.destination) return;
    
    const moduleIndex = modules.findIndex(m => m.id === moduleId);
    if (moduleIndex === -1) return;
    
    const items = Array.from(modules[moduleIndex].lessons);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Atualizar a ordem localmente
    const updatedLessons = items.map((item: any, index: number) => ({
      ...item,
      order_index: index
    }));
    
    const updatedModules = [...modules];
    updatedModules[moduleIndex].lessons = updatedLessons;
    
    setModules(updatedModules);
    
    // Atualizar a ordem no banco de dados
    try {
      await reorderLessons(updatedLessons.map((l: any) => ({ id: l.id, order_index: l.order_index })));
    } catch (error) {
      console.error("Erro ao reordenar aulas:", error);
      toast.error("Erro ao salvar a nova ordem das aulas.");
    }
  };

  // Extrair ID do vídeo do YouTube para pré-visualização
  const handlePreviewVideo = (videoUrl: string) => {
    const videoId = extractYouTubeId(videoUrl);
    if (videoId) {
      setPreviewVideo({
        open: true,
        videoId
      });
    } else {
      toast.error("URL de vídeo inválida. Certifique-se de que é uma URL do YouTube.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex justify-center items-center h-full py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados do curso...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userType="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link 
                href="/dashboard/admin/cursos" 
                className="text-sm text-muted-foreground hover:text-primary flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar para cursos
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Curso</h1>
            <p className="text-muted-foreground">
              Edite os detalhes do curso, adicione módulos e aulas.
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

          <TabsContent value="info" className="space-y-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Edite as informações principais do curso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título do Curso</Label>
                  <Input 
                    id="title"
                    name="title"
                    value={courseData.title}
                    onChange={handleInputChange}
                    placeholder="Ex: Treinamento NR10 - Segurança em Instalações Elétricas"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea 
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleInputChange}
                    placeholder="Descreva o curso, seus objetivos e público-alvo..."
                    rows={5}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="thumbnail_url">URL da Imagem de Capa</Label>
                    <Input 
                      id="thumbnail_url"
                      name="thumbnail_url"
                      value={courseData.thumbnail_url}
                      onChange={handleInputChange}
                      placeholder="https://exemplo.com/imagem.jpg"
                    />
                    {courseData.thumbnail_url && (
                      <div className="mt-2 relative h-40 w-full rounded-md overflow-hidden">
                        <Image 
                          src={courseData.thumbnail_url}
                          alt={courseData.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Categoria</Label>
                    <Select 
                      value={courseData.category} 
                      onValueChange={(value) => setCourseData({ ...courseData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="nr">Normas Regulamentadoras</SelectItem>
                        <SelectItem value="seguranca">Segurança do Trabalho</SelectItem>
                        <SelectItem value="primeiros-socorros">Primeiros Socorros</SelectItem>
                        <SelectItem value="brigada">Brigada de Incêndio</SelectItem>
                        <SelectItem value="gestao">Gestão de Segurança</SelectItem>
                      </SelectContent>
                    </Select>

                    <div className="pt-4">
                      <Label htmlFor="tags">Tags</Label>
                      <div className="flex gap-2 mt-2">
                        <Input 
                          id="tagInput"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          placeholder="Adicionar tag..."
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addTag();
                            }
                          }}
                        />
                        <Button type="button" onClick={addTag}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {courseData.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {courseData.tags.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <button 
                                type="button" 
                                onClick={() => removeTag(tag)}
                                className="rounded-full hover:bg-muted p-0.5"
                              >
                                <X className="h-3 w-3" />
                                <span className="sr-only">Remover tag {tag}</span>
                              </button>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Detalhes do Curso</CardTitle>
                <CardDescription>
                  Configure a duração, preço e status do curso.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duração (minutos)</Label>
                    <Input 
                      id="duration"
                      name="duration"
                      type="number"
                      min="0"
                      value={courseData.duration || ""}
                      onChange={handleNumericInputChange}
                      placeholder="Ex: 120"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="price">Preço (R$)</Label>
                    <Input 
                      id="price"
                      name="price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={courseData.price || ""}
                      onChange={handleNumericInputChange}
                      placeholder="Ex: 99.90"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sale_price">Preço Promocional (R$)</Label>
                    <Input 
                      id="sale_price"
                      name="sale_price"
                      type="number"
                      min="0"
                      step="0.01"
                      value={courseData.sale_price || ""}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCourseData({
                          ...courseData,
                          sale_price: value ? parseFloat(value) : null
                        });
                      }}
                      placeholder="Deixe em branco para sem promoção"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    value={courseData.status} 
                    onValueChange={(value: "draft" | "published" | "archived") => 
                      setCourseData({ ...courseData, status: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Rascunho</SelectItem>
                      <SelectItem value="published">Publicado</SelectItem>
                      <SelectItem value="archived">Arquivado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
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
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="content" className="space-y-6 mt-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Módulos e Aulas</h2>
              <Button onClick={openNewModuleDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Novo Módulo
              </Button>
            </div>

            {modules.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <div className="rounded-full bg-muted p-3 mb-4">
                    <FilePlus className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-medium mb-2">Nenhum módulo criado</h3>
                  <p className="text-muted-foreground text-center mb-4">
                    Adicione módulos para organizar o conteúdo do seu curso.
                  </p>
                  <Button onClick={openNewModuleDialog}>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Primeiro Módulo
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <DragDropContext onDragEnd={handleDragEndModules}>
                <Droppable droppableId="modules">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-4"
                    >
                      {modules.map((module, index) => (
                        <Draggable key={module.id} draggableId={module.id} index={index}>
                          {(provided) => (
                            <Card
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className="border-2"
                            >
                              <CardHeader className="flex flex-row items-start justify-between gap-4">
                                <div 
                                  {...provided.dragHandleProps}
                                  className="flex items-center mt-1"
                                >
                                  <GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" />
                                </div>
                                <div className="flex-1">
                                  <CardTitle className="text-lg group flex items-center">
                                    Módulo {index + 1}: {module.title}
                                  </CardTitle>
                                  {module.description && (
                                    <CardDescription>{module.description}</CardDescription>
                                  )}
                                </div>
                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => openEditModuleDialog(module.id)}
                                  >
                                    <Pencil className="h-4 w-4 mr-1" />
                                    Editar
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteModule(module.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </CardHeader>
                              <CardContent>
                                <div className="space-y-4">
                                  <div className="flex flex-col gap-2">
                                    {module.lessons && module.lessons.length > 0 ? (
                                      <DragDropContext onDragEnd={(result) => handleDragEndLessons(module.id, result)}>
                                        <Droppable droppableId={`lessons-${module.id}`}>
                                          {(provided) => (
                                            <div
                                              {...provided.droppableProps}
                                              ref={provided.innerRef}
                                              className="space-y-2"
                                            >
                                              {module.lessons.map((lesson: any, lessonIndex: number) => (
                                                <Draggable key={lesson.id} draggableId={lesson.id} index={lessonIndex}>
                                                  {(provided) => (
                                                    <div
                                                      ref={provided.innerRef}
                                                      {...provided.draggableProps}
                                                      className="bg-muted rounded-md p-3 flex items-center justify-between"
                                                    >
                                                      <div className="flex items-center gap-3">
                                                        <div 
                                                          {...provided.dragHandleProps}
                                                          className="cursor-grab"
                                                        >
                                                          <GripVertical className="h-4 w-4 text-muted-foreground" />
                                                        </div>
                                                        <div className="flex-1">
                                                          <div className="flex items-center gap-2">
                                                            <FileVideo className="h-4 w-4 text-muted-foreground" />
                                                            <span className="font-medium">{lesson.title}</span>
                                                            {lesson.is_free && (
                                                              <Badge variant="success">Aula Gratuita</Badge>
                                                            )}
                                                          </div>
                                                          {lesson.duration > 0 && (
                                                            <div className="text-xs text-muted-foreground mt-1">
                                                              Duração: {lesson.duration} minutos
                                                            </div>
                                                          )}
                                                        </div>
                                                      </div>
                                                      <div className="flex gap-2">
                                                        {lesson.video_url && (
                                                          <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => handlePreviewVideo(lesson.video_url)}
                                                          >
                                                            <YouTube className="h-4 w-4" />
                                                          </Button>
                                                        )}
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          onClick={() => openEditLessonDialog(module.id, lesson.id)}
                                                        >
                                                          <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                          variant="ghost"
                                                          size="sm"
                                                          className="text-destructive hover:text-destructive/90 hover:bg-destructive/10"
                                                          onClick={() => handleDeleteLesson(module.id, lesson.id)}
                                                        >
                                                          <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                      </div>
                                                    </div>
                                                  )}
                                                </Draggable>
                                              ))}
                                              {provided.placeholder}
                                            </div>
                                          )}
                                        </Droppable>
                                      </DragDropContext>
                                    ) : (
                                      <div className="text-center py-6 bg-muted/50 rounded-md">
                                        <p className="text-muted-foreground">Nenhuma aula neste módulo</p>
                                      </div>
                                    )}
                                  </div>

                                  <div className="flex gap-2 pt-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openNewLessonDialog(module.id)}
                                    >
                                      <FileVideo className="h-4 w-4 mr-1" />
                                      Adicionar Aula
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => openNewExamDialog(module.id)}
                                    >
                                      <SquareCheckbox className="h-4 w-4 mr-1" />
                                      Adicionar Prova
                                    </Button>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal para criar novo módulo */}
      <Dialog open={newModuleDialogOpen} onOpenChange={setNewModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Novo Módulo</DialogTitle>
            <DialogDescription>
              Adicione um novo módulo ao curso.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="module-title">Título do Módulo</Label>
              <Input
                id="module-title"
                value={moduleFormData.title}
                onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                placeholder="Ex: Introdução à Segurança"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="module-description">Descrição (opcional)</Label>
              <Textarea
                id="module-description"
                value={moduleFormData.description}
                onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                placeholder="Descreva brevemente o conteúdo do módulo..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewModuleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateModule}>
              Criar Módulo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar módulo */}
      <Dialog open={editModuleDialogOpen} onOpenChange={setEditModuleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Módulo</DialogTitle>
            <DialogDescription>
              Atualize as informações do módulo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-module-title">Título do Módulo</Label>
              <Input
                id="edit-module-title"
                value={moduleFormData.title}
                onChange={(e) => setModuleFormData({ ...moduleFormData, title: e.target.value })}
                placeholder="Ex: Introdução à Segurança"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-module-description">Descrição (opcional)</Label>
              <Textarea
                id="edit-module-description"
                value={moduleFormData.description}
                onChange={(e) => setModuleFormData({ ...moduleFormData, description: e.target.value })}
                placeholder="Descreva brevemente o conteúdo do módulo..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModuleDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateModule}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para criar nova aula */}
      <Dialog open={newLessonDialogOpen} onOpenChange={setNewLessonDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Nova Aula</DialogTitle>
            <DialogDescription>
              Adicione uma nova aula ao módulo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Título da Aula</Label>
              <Input
                id="lesson-title"
                value={lessonFormData.title}
                onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                placeholder="Ex: Introdução aos Conceitos Básicos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-description">Descrição (opcional)</Label>
              <Textarea
                id="lesson-description"
                value={lessonFormData.description}
                onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                placeholder="Descreva brevemente o conteúdo da aula..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-video">URL do Vídeo (YouTube)</Label>
              <div className="flex gap-2">
                <Input
                  id="lesson-video"
                  value={lessonFormData.video_url}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })}
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => handlePreviewVideo(lessonFormData.video_url)}
                  disabled={!lessonFormData.video_url}
                >
                  <YouTube className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Cole a URL completa do vídeo do YouTube
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lesson-duration">Duração (minutos)</Label>
                <Input
                  id="lesson-duration"
                  type="number"
                  min="0"
                  value={lessonFormData.duration || ""}
                  onChange={(e) => setLessonFormData({ 
                    ...lessonFormData, 
                    duration: parseInt(e.target.value) || 0 
                  })}
                  placeholder="Ex: 15"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Label htmlFor="lesson-free" className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="lesson-free"
                    checked={lessonFormData.is_free}
                    onChange={(e) => setLessonFormData({ 
                      ...lessonFormData, 
                      is_free: e.target.checked 
                    })}
                    className="sr-only peer"
                  />
                  <div className="h-4 w-4 rounded border border-primary ring-offset-background peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:bg-primary peer-checked:text-primary-foreground flex items-center justify-center">
                    {lessonFormData.is_free && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-background">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span>Aula gratuita</span>
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewLessonDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateLesson}>
              Criar Aula
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para editar aula */}
      <Dialog open={editLessonDialogOpen} onOpenChange={setEditLessonDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>Editar Aula</DialogTitle>
            <DialogDescription>
              Atualize as informações da aula.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-title">Título da Aula</Label>
              <Input
                id="edit-lesson-title"
                value={lessonFormData.title}
                onChange={(e) => setLessonFormData({ ...lessonFormData, title: e.target.value })}
                placeholder="Ex: Introdução aos Conceitos Básicos"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-description">Descrição (opcional)</Label>
              <Textarea
                id="edit-lesson-description"
                value={lessonFormData.description}
                onChange={(e) => setLessonFormData({ ...lessonFormData, description: e.target.value })}
                placeholder="Descreva brevemente o conteúdo da aula..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-lesson-video">URL do Vídeo (YouTube)</Label>
              <div className="flex gap-2">
                <Input
                  id="edit-lesson-video"
                  value={lessonFormData.video_url}
                  onChange={(e) => setLessonFormData({ ...lessonFormData, video_url: e.target.value })}
                  placeholder="Ex: https://www.youtube.com/watch?v=..."
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => handlePreviewVideo(lessonFormData.video_url)}
                  disabled={!lessonFormData.video_url}
                >
                  <YouTube className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Cole a URL completa do vídeo do YouTube
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-lesson-duration">Duração (minutos)</Label>
                <Input
                  id="edit-lesson-duration"
                  type="number"
                  min="0"
                  value={lessonFormData.duration || ""}
                  onChange={(e) => setLessonFormData({ 
                    ...lessonFormData, 
                    duration: parseInt(e.target.value) || 0 
                  })}
                  placeholder="Ex: 15"
                />
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Label htmlFor="edit-lesson-free" className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    id="edit-lesson-free"
                    checked={lessonFormData.is_free}
                    onChange={(e) => setLessonFormData({ 
                      ...lessonFormData, 
                      is_free: e.target.checked 
                    })}
                    className="sr-only peer"
                  />
                  <div className="h-4 w-4 rounded border border-primary ring-offset-background peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-checked:bg-primary peer-checked:text-primary-foreground flex items-center justify-center">
                    {lessonFormData.is_free && (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3 text-background">
                        <polyline points="20 6 9 17 4 12"></polyline>
                      </svg>
                    )}
                  </div>
                  <span>Aula gratuita</span>
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditLessonDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateLesson}>
              Salvar Alterações
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal para criar nova prova */}
      <Dialog open={newExamDialogOpen} onOpenChange={setNewExamDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Prova</DialogTitle>
            <DialogDescription>
              Adicione uma prova ao módulo.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="exam-title">Título da Prova</Label>
              <Input
                id="exam-title"
                value={examFormData.title}
                onChange={(e) => setExamFormData({ ...examFormData, title: e.target.value })}
                placeholder="Ex: Avaliação Final do Módulo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-description">Descrição (opcional)</Label>
              <Textarea
                id="exam-description"
                value={examFormData.description}
                onChange={(e) => setExamFormData({ ...examFormData, description: e.target.value })}
                placeholder="Instruções ou descrição da prova..."
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="exam-passing-score">Nota de Aprovação (%)</Label>
                <Input
                  id="exam-passing-score"
                  type="number"
                  min="1"
                  max="100"
                  value={examFormData.passing_score}
                  onChange={(e) => setExamFormData({ 
                    ...examFormData, 
                    passing_score: parseInt(e.target.value) || 70 
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="exam-time-limit">Tempo Limite (minutos)</Label>
                <Input
                  id="exam-time-limit"
                  type="number"
                  min="0"
                  value={examFormData.time_limit}
                  onChange={(e) => setExamFormData({ 
                    ...examFormData, 
                    time_limit: parseInt(e.target.value) || 0 
                  })}
                  placeholder="0 = sem limite"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-attempts">Tentativas Permitidas</Label>
              <Input
                id="exam-attempts"
                type="number"
                min="1"
                value={examFormData.attempts_allowed}
                onChange={(e) => setExamFormData({ 
                  ...examFormData, 
                  attempts_allowed: parseInt(e.target.value) || 1 
                })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewExamDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreateExam}>
              Criar Prova
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de visualização de vídeo */}
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