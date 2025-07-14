"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, Plus, Save } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CourseDetailsFormProps {
  courseData: any;
  setCourseData: (data: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CourseDetailsForm({ courseData, setCourseData, onSave, isSaving }: CourseDetailsFormProps) {
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
      tags: courseData.tags.filter((tag: string) => tag !== tagToRemove)
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Informações Básicas</CardTitle>
          <CardDescription>Edite as informações principais do curso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Curso</Label>
            <Input id="title" name="title" value={courseData.title} onChange={handleInputChange} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea id="description" name="description" value={courseData.description} onChange={handleInputChange} rows={5} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">URL da Imagem de Capa</Label>
              <Input id="thumbnail_url" name="thumbnail_url" value={courseData.thumbnail_url} onChange={handleInputChange} />
              {courseData.thumbnail_url && (
                <div className="mt-2 relative h-40 w-full rounded-md overflow-hidden">
                  <Image src={courseData.thumbnail_url} alt={courseData.title} fill className="object-cover" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Categoria</Label>
              <Select value={courseData.category} onValueChange={(value) => setCourseData({ ...courseData, category: value })}>
                <SelectTrigger><SelectValue placeholder="Selecione uma categoria" /></SelectTrigger>
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
                  <Input id="tagInput" value={tagInput} onChange={(e) => setTagInput(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }} />
                  <Button type="button" onClick={addTag}><Plus className="h-4 w-4" /></Button>
                </div>
                {courseData.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {courseData.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <button type="button" onClick={() => removeTag(tag)} className="rounded-full hover:bg-muted p-0.5">
                          <X className="h-3 w-3" /><span className="sr-only">Remover tag {tag}</span>
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
          <CardDescription>Configure a duração, preço e status do curso.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="duration">Duração (minutos)</Label>
              <Input id="duration" name="duration" type="number" min="0" value={courseData.duration || ""} onChange={handleNumericInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Preço (R$)</Label>
              <Input id="price" name="price" type="number" min="0" step="0.01" value={courseData.price || ""} onChange={handleNumericInputChange} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Preço Promocional (R$)</Label>
              <Input id="sale_price" name="sale_price" type="number" min="0" step="0.01" value={courseData.sale_price || ""} onChange={(e) => { const value = e.target.value; setCourseData({ ...courseData, sale_price: value ? parseFloat(value) : null }); }} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={courseData.status} onValueChange={(value: "draft" | "published" | "archived") => setCourseData({ ...courseData, status: value })}>
              <SelectTrigger><SelectValue placeholder="Selecione o status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Rascunho</SelectItem>
                <SelectItem value="published">Publicado</SelectItem>
                <SelectItem value="archived">Arquivado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={onSave} disabled={isSaving}>
            {isSaving ? (<><div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent"></div>Salvando...</>) : (<><Save className="mr-2 h-4 w-4" />Salvar Alterações</>)}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}