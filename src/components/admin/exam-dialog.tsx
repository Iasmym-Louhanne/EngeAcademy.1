"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ExamDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

export function ExamDialog({ isOpen, onClose, onSave }: ExamDialogProps) {
  const [formData, setFormData] = useState({ title: "", description: "", passing_score: 70, time_limit: 30, attempts_allowed: 3 });

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova Prova</DialogTitle>
          <DialogDescription>Preencha as informações da prova.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="exam-title">Título</Label>
            <Input id="exam-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="exam-description">Descrição</Label>
            <Textarea id="exam-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exam-passing-score">Nota de Aprovação (%)</Label>
              <Input id="exam-passing-score" type="number" value={formData.passing_score} onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) || 70 })} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exam-time-limit">Tempo Limite (minutos)</Label>
              <Input id="exam-time-limit" type="number" value={formData.time_limit} onChange={(e) => setFormData({ ...formData, time_limit: parseInt(e.target.value) || 0 })} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exam-attempts">Tentativas Permitidas</Label>
            <Input id="exam-attempts" type="number" value={formData.attempts_allowed} onChange={(e) => setFormData({ ...formData, attempts_allowed: parseInt(e.target.value) || 1 })} />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>Criar e Editar Questões</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}