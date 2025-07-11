"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";

interface CourseQuizSettingsProps {
  course: any;
  setCourse: (course: any) => void;
}

export function CourseQuizSettings({ course, setCourse }: CourseQuizSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações da Prova Final</CardTitle>
        <CardDescription>
          Defina as questões, alternativas e a nota de corte para a aprovação.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="passingGrade">Nota para Aprovação (%)</Label>
          <Input
            id="passingGrade"
            name="passingGrade"
            type="number"
            min="0"
            max="100"
            value={course.passingGrade}
            onChange={(e) => setCourse({ ...course, passingGrade: parseFloat(e.target.value) })}
            className="w-48"
          />
        </div>
        
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Questões da Prova</h3>
          <div className="text-center py-8 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">A funcionalidade de criação de questões será implementada em breve.</p>
            <Button variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Questão
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}