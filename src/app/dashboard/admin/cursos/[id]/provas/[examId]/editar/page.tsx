"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, Plus, Save, Trash2, Check, AlertCircle, GripVertical } from "lucide-react";
import { getExamWithQuestions, getExamById, updateExam, createQuestion, updateQuestion, deleteQuestion, reorderQuestions } from "@/lib/exam-service";
import { getCourseById } from "@/lib/course-service";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { QuestionDialog, QuestionData } from "@/components/admin/question-dialog";

export default function EditExamPage() {
  const router = useRouter();
  const { id, examId } = useParams<{ id: string, examId: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Dados do curso e prova
  const [courseTitle, setCourseTitle] = useState("");
  const [exam, setExam] = useState<any>({
    id: "",
    module_id: "",
    title: "",
    description: "",
    passing_score: 70,
    time_limit: 30,
    attempts_allowed: 3
  });
  
  // Questões
  const [questions, setQuestions] = useState<any[]>([]);
  
  // Diálogo de questão
  const [questionDialogOpen, setQuestionDialogOpen] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState<any | null>(null);

  // Carregar dados da prova
  useEffect(() => {
    const loadExam = async () => {
      try {
        const examWithQuestions = await getExamWithQuestions(examId);
        const course = await getCourseById(id);
        
        setCourseTitle(course.title);
        setExam({
          id: examWithQuestions.id,
          module_id: examWithQuestions.module_id,
          title: examWithQuestions.title,
          description: examWithQuestions.description,
          passing_score: examWithQuestions.passing_score,
          time_limit: examWithQuestions.time_limit,
          attempts_allowed: examWithQuestions.attempts_allowed
        });
        
        setQuestions(examWithQuestions.questions || []);
        
      } catch (error) {
        console.error("Erro ao carregar prova:", error);
        toast.error("Não foi possível carregar os dados da prova.");
      } finally {
        setIsLoading(false);
      }
    };
    
    if (id && examId) {
      loadExam();
    }
  }, [id, examId]);

  const handleExamInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExam({ ...exam, [name]: value });
  };

  const handleExamNumericInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numericValue = parseInt(value);
    setExam({ ...exam, [name]: isNaN(numericValue) ? 0 : numericValue });
  };

  const handleSaveExam = async () => {
    setIsSaving(true);
    
    try {
      await updateExam(exam.id, exam);
      toast.success("Prova atualizada com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar prova:", error);
      toast.error("Erro ao atualizar prova. Verifique os dados e tente novamente.");
    } finally {
      setIsSaving(false);
    }
  };

  // Manipulação de questões
  const openNewQuestionDialog = () => {
    setCurrentQuestion(null);
    setQuestionDialogOpen(true);
  };

  const openEditQuestionDialog = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setCurrentQuestion(question);
      setQuestionDialogOpen(true);
    }
  };

  const handleSaveQuestion = async (data: QuestionData) => {
    try {
      if (currentQuestion) {
        const updated = await updateQuestion(
          currentQuestion.id,
          {
            question_text: data.question_text,
            question_type: data.question_type,
            points: data.points
          },
          data.options
        );
        setQuestions(questions.map(q => q.id === currentQuestion.id ? updated : q));
        toast.success("Questão atualizada com sucesso!");
      } else {
        const newQuestion = await createQuestion(
          {
            exam_id: exam.id,
            question_text: data.question_text,
            question_type: data.question_type,
            points: data.points,
            order_index: questions.length
          },
          data.options
        );
        setQuestions([...questions, newQuestion]);
        toast.success("Questão criada com sucesso!");
      }
      setQuestionDialogOpen(false);
    } catch (error) {
      console.error("Erro ao salvar questão:", error);
      toast.error("Erro ao salvar questão. Tente novamente.");
    }
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (confirm("Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.")) {
      try {
        await deleteQuestion(questionId);
        setQuestions(questions.filter(q => q.id !== questionId));
        toast.success("Questão excluída com sucesso!");
      } catch (error) {
        console.error("Erro ao excluir questão:", error);
        toast.error("Erro ao excluir questão. Tente novamente.");
      }
    }
  };

  // Reordenar questões
  const handleDragEnd = async (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    // Atualizar a ordem localmente
    const updatedQuestions = items.map((item, index) => ({
      ...item,
      order_index: index
    }));
    
    setQuestions(updatedQuestions);
    
    // Atualizar a ordem no banco de dados
    try {
      await reorderQuestions(updatedQuestions.map(q => ({ id: q.id, order_index: q.order_index })));
    } catch (error) {
      console.error("Erro ao reordenar questões:", error);
      toast.error("Erro ao salvar a nova ordem das questões.");
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout userType="admin">
        <div className="flex justify-center items-center h-full py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-muted-foreground">Carregando dados da prova...</p>
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
                href={`/dashboard/admin/cursos/${id}/editar`} 
                className="text-sm text-muted-foreground hover:text-primary flex items-center"
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Voltar para o curso
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Editar Prova</h1>
            <p className="text-muted-foreground">
              {courseTitle} &gt; {exam.title}
            </p>
          </div>
          <Button onClick={handleSaveExam} disabled={isSaving}>
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Prova</CardTitle>
                <CardDescription>
                  Defina as regras e parâmetros da prova.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Título da Prova</Label>
                  <Input
                    id="title"
                    name="title"
                    value={exam.title}
                    onChange={handleExamInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Descrição/Instruções</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={exam.description || ""}
                    onChange={handleExamInputChange}
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="passing_score">Nota de Aprovação (%)</Label>
                  <Input
                    id="passing_score"
                    name="passing_score"
                    type="number"
                    min="1"
                    max="100"
                    value={exam.passing_score}
                    onChange={handleExamNumericInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="time_limit">Tempo Limite (minutos)</Label>
                  <Input
                    id="time_limit"
                    name="time_limit"
                    type="number"
                    min="0"
                    value={exam.time_limit || ""}
                    onChange={handleExamNumericInputChange}
                    placeholder="0 = sem limite"
                  />
                  <p className="text-xs text-muted-foreground">
                    Deixe em branco para não definir limite de tempo
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="attempts_allowed">Tentativas Permitidas</Label>
                  <Input
                    id="attempts_allowed"
                    name="attempts_allowed"
                    type="number"
                    min="1"
                    value={exam.attempts_allowed}
                    onChange={handleExamNumericInputChange}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleSaveExam} className="w-full" disabled={isSaving}>
                  {isSaving ? "Salvando..." : "Salvar Configurações"}
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total de Questões:</span>
                  <span className="font-medium">{questions.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Pontuação Total:</span>
                  <span className="font-medium">{questions.reduce((sum, q) => sum + q.points, 0)} pontos</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo de Questões:</span>
                  <span className="font-medium">
                    {questions.filter(q => q.question_type === "multiple_choice").length} múltipla escolha / {questions.filter(q => q.question_type === "true_false").length} V/F
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Questões</CardTitle>
                  <CardDescription>
                    Adicione e gerencie as questões da prova.
                  </CardDescription>
                </div>
                <Button onClick={openNewQuestionDialog}>
                  <Plus className="mr-2 h-4 w-4" />
                  Nova Questão
                </Button>
              </CardHeader>
              <CardContent>
                {questions.length === 0 ? (
                  <div className="text-center py-12 border rounded-md">
                    <AlertCircle className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                    <p className="text-muted-foreground mb-4">Nenhuma questão criada ainda.</p>
                    <Button onClick={openNewQuestionDialog}>
                      <Plus className="mr-2 h-4 w-4" />
                      Adicionar Primeira Questão
                    </Button>
                  </div>
                ) : (
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="questions">
                      {(provided) => (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className="space-y-4"
                        >
                          {questions.map((question, index) => (
                            <Draggable key={question.id} draggableId={question.id} index={index}>
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  className="border rounded-md p-4"
                                >
                                  <div className="flex gap-3">
                                    <div 
                                      {...provided.dragHandleProps}
                                      className="cursor-grab flex items-start pt-1"
                                    >
                                      <GripVertical className="h-5 w-5 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-2">
                                          <span className="font-semibold">Questão {index + 1}</span>
                                          <span className="text-xs text-muted-foreground">
                                            ({question.points} {question.points === 1 ? "ponto" : "pontos"})
                                          </span>
                                          <Badge variant="outline" className="text-xs">
                                            {question.question_type === "multiple_choice" 
                                              ? "Múltipla Escolha" 
                                              : "Verdadeiro/Falso"}
                                          </Badge>
                                        </div>
                                        <div className="flex gap-2">
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => openEditQuestionDialog(question.id)}
                                          >
                                            Editar
                                          </Button>
                                          <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive"
                                            onClick={() => handleDeleteQuestion(question.id)}
                                          >
                                            <Trash2 className="h-4 w-4" />
                                          </Button>
                                        </div>
                                      </div>
                                      <div className="mb-3 font-medium">{question.question_text}</div>
                                      <div className="space-y-2">
                                        {question.options.map((option: any, optIndex: number) => (
                                          <div 
                                            key={option.id} 
                                            className={`flex items-center gap-2 p-2 rounded-md ${
                                              option.is_correct ? 'bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900' : ''
                                            }`}
                                          >
                                            <div className={`w-5 h-5 flex items-center justify-center rounded-full ${
                                              option.is_correct 
                                                ? 'bg-green-600 text-white' 
                                                : 'border border-muted-foreground'
                                            }`}>
                                              {option.is_correct && <Check className="h-3 w-3" />}
                                            </div>
                                            <span>{option.option_text}</span>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
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
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Modal de questões */}
      <QuestionDialog
        isOpen={questionDialogOpen}
        onClose={() => setQuestionDialogOpen(false)}
        onSave={handleSaveQuestion}
        question={currentQuestion}
      />
    </DashboardLayout>
  );
}

// Componente Badge
function Badge({ variant, className, children }: { variant?: string, className?: string, children: React.ReactNode }) {
  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantClass = variant === "outline" 
    ? "border border-gray-200 dark:border-gray-800"
    : "bg-primary text-white";
  
  return (
    <span className={`${baseClass} ${variantClass} ${className || ""}`}>
      {children}
    </span>
  );
}