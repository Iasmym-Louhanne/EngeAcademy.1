"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { extractYouTubeId } from "@/lib/course-service";

interface LessonDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  lesson: any | null;
}

export function LessonDialog({ isOpen, onClose, onSave, lesson }: LessonDialogProps) {
  const [formData, setFormData] = useState({ title: "", description: "", video_url: "", duration: 0, is_free: false });

  useEffect(() => {
    if (lesson) {
      setFormData({ title: lesson.title, description: lesson.description, video_url: lesson.video_url, duration: lesson.duration, is_free: lesson.is_free });
    } else {
      setFormData({ title: "", description: "", video_url: "", duration: 0, is_free: false });
    }
  }, [lesson, isOpen]);

  const handleSave = () => {
    const videoId = extractYouTubeId(formData.video_url) || formData.video_url;
    onSave({ ...formData, video_url: videoId });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{lesson ? "Editar Aula" : "Nova Aula"}</DialogTitle>
          <DialogDescription>Preencha as informações da aula.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="lesson-title">Título</Label>
            <Input id="lesson-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-description">Descrição</Label>
            <Textarea id="lesson-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-video">URL do Vídeo (YouTube)</Label>
            <Input id="lesson-video" value={formData.video_url} onChange={(e) => setFormData({ ...formData, video_url: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lesson-duration">Duração (minutos)</Label>
              <Input id="lesson-duration" type="number" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="flex items-center space-x-2 pt-8">
              <Checkbox id="lesson-free" checked={formData.is_free} onCheckedChange={(checked) => setFormData({ ...formData, is_free: !!checked })} />
              <Label htmlFor="lesson-free">Aula gratuita</Label>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Salvar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}