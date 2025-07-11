"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard/shared/dashboard-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createCourse } from "@/lib/course-service";
import { toast } from "sonner";
import { ChevronLeft, Plus, X } from "lucide-react";
import Link from "next/link";

export default function NewCoursePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [courseData, setCourseData] = useState({
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

  const [tagInput, setTagInput] = useState("");

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const newCourse = await createCourse(courseData);
      toast.success("Curso criado com sucesso!");
      router.push(`/dashboard/admin/cursos/${newCourse.id}/editar`);
    } catch (error) {
      console.error("Erro ao criar curso:", error);
      toast.error("Erro ao criar curso. Verifique os dados e tente novamente.");
      setIsSubmitting(false);
    }
  };

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
                Voltar
              </Link>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Novo Curso</h1>
            <p className="text-muted-foreground">
              Preencha os dados para criar um novo curso.
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Informações Básicas</CardTitle>
                <CardDescription>
                  Defina as informações principais do curso.
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex gap-2">
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
            </Card>

            <div className="flex justify-end gap-4">
              <Link href="/dashboard/admin/cursos">
                <Button variant="outline" type="button">Cancelar</Button>
              </Link>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>
                    Salvando...
                  </>
                ) : (
                  "Criar Curso"
                )}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}