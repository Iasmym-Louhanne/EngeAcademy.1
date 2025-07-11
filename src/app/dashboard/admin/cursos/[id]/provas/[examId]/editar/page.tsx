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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { ChevronLeft, Plus, Save, Trash2, Check, AlertCircle, GripVertical, MoveVertical } from "lucide-react";
import { getExamWithQuestions, getExamById, updateExam, createQuestion, updateQuestion, deleteQuestion, reorderQuestions } from "@/lib/exam-service";
import { getCourseById } from "@/lib/course-service";
import { toast } from "sonner";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

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
  
  // Diálogo de nova questão
  const [newQuestionDialogOpen, setNewQuestionDialogOpen] = useState(false);
  const [editQuestionId, setEditQuestionId] = useState<string | null>(null);
  
  // Formulário de questão
  const [questionForm, setQuestionForm] = useState({
    question_text: "",
    question_type: "multiple_choice" as "multiple_choice" | "true_false",
    points: 1,
    options: [
      { option_text: "", is_correct: false, order_index: 0 },
      { option_text: "", is_correct: false, order_index: 1 }
    ]
  });

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
    setQuestionForm({
      question_text: "",
      question_type: "multiple_choice",
      points: 1,
      options: [
        { option_text: "", is_correct: false, order_index: 0 },
        { option_text: "", is_correct: false, order_index: 1 }
      ]
    });
    setEditQuestionId(null);
    setNewQuestionDialogOpen(true);
  };

  const openEditQuestionDialog = (questionId: string) => {
    const question = questions.find(q => q.id === questionId);
    if (question) {
      setQuestionForm({
        question_text: question.question_text,
        question_type: question.question_type,
        points: question.points,
        options: [...question.options] // Clone das opções
      });
      setEditQuestionId(questionId);
      setNewQuestionDialogOpen(true);
    }
  };

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuestionForm({
      ...questionForm,
      question_text: e.target.value
    });
  };

  const handleQuestionTypeChange = (value: "multiple_choice" | "true_false") => {
    let newOptions;
    
    if (value === "true_false") {
      newOptions = [
        { option_text: "Verdadeiro", is_correct: false, order_index: 0 },
        { option_text: "Falso", is_correct: false, order_index: 1 }
      ];
    } else if (questionForm.question_type === "true_false") {
      newOptions = [
        { option_text: "", is_correct: false, order_index: 0 },
        { option_text: "", is_correct: false, order_index: 1 }
      ];
    } else {
      newOptions = [...questionForm.options];
    }
    
    setQuestionForm({
      ...questionForm,
      question_type: value,
      options: newOptions
    });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value);
    setQuestionForm({
      ...questionForm,
      points: isNaN(points) ? 1 : points
    });
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...questionForm.options];
    newOptions[index].option_text = text;
    setQuestionForm({
      ...questionForm,
      options: newOptions
    });
  };

  const handleCorrectOptionChange = (index: number) => {
    const newOptions = questionForm.options.map((option, i) => ({
      ...option,
      is_correct: i === index
    }));
    
    setQuestionForm({
      ...questionForm,
      options: newOptions
    });
  };

  const addOption = () => {
    if (questionForm.options.length >= 6) {
      toast.error("Máximo de 6 opções permitidas.");
      return;
    }
    
    setQuestionForm({
      ...questionForm,
      options: [
        ...questionForm.options,
        { 
          option_text: "", 
          is_correct: false, 
          order_index: questionForm.options.length 
        }
      ]
    });
  };

  const removeOption = (index: number) => {
    if (questionForm.options.length <= 2) {
      toast.error("Mínimo de 2 opções necessárias.");
      return;
    }
    
    const newOptions = questionForm.options.filter((_, i) => i !== index);
    
    // Se removermos a opção correta, defina a primeira como correta
    const hasCorrectOption = newOptions.some(opt => opt.is_correct);
    if (!hasCorrectOption) {
      newOptions[0].is_correct = true;
    }
    
    // Reordenar índices
    const reorderedOptions = newOptions.map((opt, i) => ({
      ...opt,
      order_index: i
    }));
    
    setQuestionForm({
      ...questionForm,
      options: reorderedOptions
    });
  };

  const handleSaveQuestion = async () => {
    // Validação
    if (!questionForm.question_text.trim()) {
      toast.error("O texto da questão é obrigatório.");
      return;
    }
    
    if (!questionForm.options.some(opt => opt.is_correct)) {
      toast.error("Selecione uma opção correta.");
      return;
    }
    
    if (questionForm.options.some(opt => !opt.option_text.trim())) {
      toast.error("Todas as opções devem ter um texto.");
      return;
    }
    
    try {
      if (editQuestionId) {
        // Atualizar questão existente
        const updatedQuestion = await updateQuestion(
          editQuestionId,
          {
            question_text: questionForm.question_text,
            question_type: questionForm.question_type,
            points: questionForm.points
          },
          questionForm.options
        );
        
        setQuestions(questions.map(q => q.id === editQuestionId ? updatedQuestion : q));
        toast.success("Questão atualizada com sucesso!");
      } else {
        // Criar nova questão
        const newQuestion = await createQuestion(
          {
            exam_id: exam.id,
            question_text: questionForm.question_text,
            question_type: questionForm.question_type,
            points: questionForm.points,
            order_index: questions.length
          },
          questionForm.options
        );
        
        setQuestions([...questions, newQuestion]);
        toast.success("Questão criada com sucesso!");
      }
      
      setNewQuestionDialogOpen(false);
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

      {/* Modal para adicionar/editar questão */}
      <Dialog open={newQuestionDialogOpen} onOpenChange={setNewQuestionDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{editQuestionId ? "Editar Questão" : "Nova Questão"}</DialogTitle>
            <DialogDescription>
              {editQuestionId 
                ? "Modifique os detalhes da questão." 
                : "Adicione uma nova questão à prova."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question-text">Texto da Questão</Label>
              <Textarea
                id="question-text"
                value={questionForm.question_text}
                onChange={handleQuestionTextChange}
                placeholder="Digite o enunciado da questão..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="question-type">Tipo de Questão</Label>
                <Select
                  value={questionForm.question_type}
                  onValueChange={(value: "multiple_choice" | "true_false") => 
                    handleQuestionTypeChange(value)
                  }
                >
                  <SelectTrigger id="question-type">
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="multiple_choice">Múltipla Escolha</SelectItem>
                    <SelectItem value="true_false">Verdadeiro/Falso</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="question-points">Pontos</Label>
                <Input
                  id="question-points"
                  type="number"
                  min="1"
                  value={questionForm.points}
                  onChange={handlePointsChange}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>Opções de Resposta</Label>
                {questionForm.question_type === "multiple_choice" && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addOption}
                    disabled={questionForm.options.length >= 6}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Opção
                  </Button>
                )}
              </div>
              
              <div className="space-y-3 mt-2">
                <RadioGroup value={questionForm.options.findIndex(opt => opt.is_correct).toString()}>
                  {questionForm.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <RadioGroupItem
                        value={index.toString()}
                        id={`option-${index}`}
                        checked={option.is_correct}
                        onClick={() => handleCorrectOptionChange(index)}
                      />
                      <div className="flex-1">
                        <Input
                          value={option.option_text}
                          onChange={(e) => handleOptionTextChange(index, e.target.value)}
                          placeholder={`Opção ${index + 1}`}
                          disabled={questionForm.question_type === "true_false"}
                        />
                      </div>
                      {questionForm.question_type === "multiple_choice" && questionForm.options.length > 2 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(index)}
                          className="text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </RadioGroup>
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                Selecione o círculo à esquerda para definir a resposta correta.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewQuestionDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveQuestion}>
              {editQuestionId ? "Atualizar Questão" : "Adicionar Questão"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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