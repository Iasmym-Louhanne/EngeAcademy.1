"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ModuleDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  module: any | null;
}

export function ModuleDialog({ isOpen, onClose, onSave, module }: ModuleDialogProps) {
  const [formData, setFormData] = useState({ title: "", description: "" });

  useEffect(() => {
    if (module) {
      setFormData({ title: module.title, description: module.description });
    } else {
      setFormData({ title: "", description: "" });
    }
  }, [module, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{module ? "Editar Módulo" : "Novo Módulo"}</DialogTitle>
          <DialogDescription>Preencha as informações do módulo.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="module-title">Título</Label>
            <Input id="module-title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="module-description">Descrição</Label>
            <Textarea id="module-description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
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