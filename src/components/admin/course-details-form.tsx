"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

interface CourseDetailsFormProps {
  course: any;
  setCourse: (course: any) => void;
}

export function CourseDetailsForm({ course, setCourse }: CourseDetailsFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isNumber = type === 'number';
    setCourse({ ...course, [name]: isNumber ? parseFloat(value) : value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setCourse({ ...course, featured: checked });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informações do Curso</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título do Curso</Label>
            <Input id="title" name="title" value={course.title} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="duration">Duração</Label>
            <Input id="duration" name="duration" placeholder="Ex: 8 horas" value={course.duration} onChange={handleChange} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea id="description" name="description" value={course.description} onChange={handleChange} />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input id="price" name="price" type="number" value={course.price} onChange={handleChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="passingGrade">Nota para Aprovação (%)</Label>
            <Input id="passingGrade" name="passingGrade" type="number" min="0" max="100" value={course.passingGrade} onChange={handleChange} />
          </div>
        </div>
        <div className="flex items-center space-x-2 pt-2">
          <Switch
            id="isActive"
            checked={course.featured}
            onCheckedChange={handleSwitchChange}
          />
          <Label htmlFor="isActive">Curso Ativo/Visível</Label>
        </div>
      </CardContent>
    </Card>
  );
}