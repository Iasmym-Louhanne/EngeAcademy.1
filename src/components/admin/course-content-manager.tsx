"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, Pencil, Trash2, GripVertical, FileVideo, SquareCheck, Youtube } from "lucide-react";

interface CourseContentManagerProps {
  modules: any[];
  onReorderModules: (result: any) => void;
  onReorderLessons: (moduleId: string, result: any) => void;
  onNewModule: () => void;
  onEditModule: (moduleId: string) => void;
  onDeleteModule: (moduleId: string) => void;
  onNewLesson: (moduleId: string) => void;
  onEditLesson: (moduleId: string, lessonId: string) => void;
  onDeleteLesson: (moduleId: string, lessonId: string) => void;
  onNewExam: (moduleId: string) => void;
  onPreviewVideo: (videoUrl: string) => void;
}

export function CourseContentManager({
  modules,
  onReorderModules,
  onReorderLessons,
  onNewModule,
  onEditModule,
  onDeleteModule,
  onNewLesson,
  onEditLesson,
  onDeleteLesson,
  onNewExam,
  onPreviewVideo
}: CourseContentManagerProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Módulos e Aulas</h2>
        <Button onClick={onNewModule}><Plus className="mr-2 h-4 w-4" />Novo Módulo</Button>
      </div>
      {modules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <h3 className="text-lg font-medium mb-2">Nenhum módulo criado</h3>
            <p className="text-muted-foreground text-center mb-4">Adicione módulos para organizar o conteúdo do seu curso.</p>
            <Button onClick={onNewModule}><Plus className="mr-2 h-4 w-4" />Criar Primeiro Módulo</Button>
          </CardContent>
        </Card>
      ) : (
        <DragDropContext onDragEnd={onReorderModules}>
          <Droppable droppableId="modules">
            {(provided) => (
              <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                {modules.map((module, index) => (
                  <Draggable key={module.id} draggableId={module.id} index={index}>
                    {(provided) => (
                      <Card ref={provided.innerRef} {...provided.draggableProps} className="border-2">
                        <CardHeader className="flex flex-row items-start justify-between gap-4">
                          <div {...provided.dragHandleProps} className="flex items-center mt-1"><GripVertical className="h-5 w-5 text-muted-foreground cursor-grab" /></div>
                          <div className="flex-1">
                            <CardTitle className="text-lg group flex items-center">Módulo {index + 1}: {module.title}</CardTitle>
                            {module.description && <CardDescription>{module.description}</CardDescription>}
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => onEditModule(module.id)}><Pencil className="h-4 w-4 mr-1" />Editar</Button>
                            <Button variant="destructive" size="sm" onClick={() => onDeleteModule(module.id)}><Trash2 className="h-4 w-4" /></Button>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex flex-col gap-2">
                              {module.lessons && module.lessons.length > 0 ? (
                                <DragDropContext onDragEnd={(result) => onReorderLessons(module.id, result)}>
                                  <Droppable droppableId={`lessons-${module.id}`}>
                                    {(provided) => (
                                      <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                                        {module.lessons.map((lesson: any, lessonIndex: number) => (
                                          <Draggable key={lesson.id} draggableId={lesson.id} index={lessonIndex}>
                                            {(provided) => (
                                              <div ref={provided.innerRef} {...provided.draggableProps} className="bg-muted rounded-md p-3 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                  <div {...provided.dragHandleProps} className="cursor-grab"><GripVertical className="h-4 w-4 text-muted-foreground" /></div>
                                                  <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                      <FileVideo className="h-4 w-4 text-muted-foreground" />
                                                      <span className="font-medium">{lesson.title}</span>
                                                      {lesson.is_free && <Badge variant="success">Aula Gratuita</Badge>}
                                                    </div>
                                                    {lesson.duration > 0 && <div className="text-xs text-muted-foreground mt-1">Duração: {lesson.duration} minutos</div>}
                                                  </div>
                                                </div>
                                                <div className="flex gap-2">
                                                  {lesson.video_url && <Button variant="ghost" size="sm" onClick={() => onPreviewVideo(lesson.video_url)}><Youtube className="h-4 w-4" /></Button>}
                                                  <Button variant="ghost" size="sm" onClick={() => onEditLesson(module.id, lesson.id)}><Pencil className="h-4 w-4" /></Button>
                                                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/90 hover:bg-destructive/10" onClick={() => onDeleteLesson(module.id, lesson.id)}><Trash2 className="h-4 w-4" /></Button>
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
                                <div className="text-center py-6 bg-muted/50 rounded-md"><p className="text-muted-foreground">Nenhuma aula neste módulo</p></div>
                              )}
                            </div>
                            <div className="flex gap-2 pt-2">
                              <Button variant="outline" size="sm" onClick={() => onNewLesson(module.id)}><FileVideo className="h-4 w-4 mr-1" />Adicionar Aula</Button>
                              <Button variant="outline" size="sm" onClick={() => onNewExam(module.id)}><SquareCheck className="h-4 w-4 mr-1" />Adicionar Prova</Button>
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
    </div>
  );
}