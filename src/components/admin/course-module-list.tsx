"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plus, Trash2, GripVertical, Video } from "lucide-react";
import { toast } from "sonner";

interface CourseModuleListProps {
  modules: any[];
  setModules: (modules: any[]) => void;
}

export function CourseModuleList({ modules, setModules }: CourseModuleListProps) {
  const [newModuleTitle, setNewModuleTitle] = useState("");

  const addModule = () => {
    if (!newModuleTitle.trim()) {
      toast.error("O título do módulo não pode ser vazio.");
      return;
    }
    const newModule = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle,
      order: modules.length + 1,
      lessons: [],
    };
    setModules([...modules, newModule]);
    setNewModuleTitle("");
    toast.success("Módulo adicionado!");
  };

  const deleteModule = (moduleId: string) => {
    if (confirm("Tem certeza que deseja excluir este módulo e todas as suas aulas?")) {
      setModules(modules.filter(m => m.id !== moduleId));
      toast.success("Módulo removido.");
    }
  };

  const addLesson = (moduleId: string) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const newLesson = {
          id: `les-${Date.now()}`,
          title: "Nova Aula",
          videoId: "",
          order: module.lessons.length + 1,
        };
        return { ...module, lessons: [...module.lessons, newLesson] };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const updateLesson = (moduleId: string, lessonId: string, field: string, value: string) => {
    const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.map((lesson: any) => 
          lesson.id === lessonId ? { ...lesson, [field]: value } : lesson
        );
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    setModules(updatedModules);
  };

  const deleteLesson = (moduleId: string, lessonId: string) => {
     const updatedModules = modules.map(module => {
      if (module.id === moduleId) {
        const updatedLessons = module.lessons.filter((lesson: any) => lesson.id !== lessonId);
        return { ...module, lessons: updatedLessons };
      }
      return module;
    });
    setModules(updatedModules);
    toast.success("Aula removida.");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Módulos e Aulas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            placeholder="Título do novo módulo"
            value={newModuleTitle}
            onChange={(e) => setNewModuleTitle(e.target.value)}
          />
          <Button onClick={addModule}>Adicionar Módulo</Button>
        </div>

        <Accordion type="multiple" className="w-full space-y-2">
          {modules.map((module) => (
            <AccordionItem value={module.id} key={module.id} className="border rounded-md">
              <AccordionTrigger className="px-4 hover:no-underline">
                <div className="flex items-center gap-2 w-full">
                  <GripVertical className="h-5 w-5 text-muted-foreground" />
                  <span className="font-semibold">{module.title}</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pt-2 pb-4 space-y-3">
                {module.lessons.map((lesson: any) => (
                  <div key={lesson.id} className="flex items-center gap-2 p-2 border rounded-md">
                    <Video className="h-4 w-4 text-muted-foreground" />
                    <Input 
                      placeholder="Título da aula" 
                      className="flex-1"
                      value={lesson.title}
                      onChange={(e) => updateLesson(module.id, lesson.id, 'title', e.target.value)}
                    />
                    <Input 
                      placeholder="ID do Vídeo do YouTube" 
                      className="flex-1"
                      value={lesson.videoId}
                      onChange={(e) => updateLesson(module.id, lesson.id, 'videoId', e.target.value)}
                    />
                    <Button variant="ghost" size="icon" onClick={() => deleteLesson(module.id, lesson.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-4">
                  <Button variant="outline" size="sm" onClick={() => addLesson(module.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Aula
                  </Button>
                   <Button variant="ghost" size="sm" className="text-destructive" onClick={() => deleteModule(module.id)}>
                    Excluir Módulo
                  </Button>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}