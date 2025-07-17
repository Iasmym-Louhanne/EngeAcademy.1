"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";

interface QuestionOption {
  option_text: string;
  is_correct: boolean;
  order_index: number;
}

export interface QuestionData {
  question_text: string;
  question_type: "multiple_choice" | "true_false";
  points: number;
  options: QuestionOption[];
}

interface QuestionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: QuestionData) => void;
  question: QuestionData | null;
}

export function QuestionDialog({
  isOpen,
  onClose,
  onSave,
  question
}: QuestionDialogProps) {
  const [formData, setFormData] = useState<QuestionData>({
    question_text: "",
    question_type: "multiple_choice",
    points: 1,
    options: [
      { option_text: "", is_correct: true, order_index: 0 },
      { option_text: "", is_correct: false, order_index: 1 }
    ]
  });

  useEffect(() => {
    if (question) {
      setFormData(question);
    } else {
      setFormData({
        question_text: "",
        question_type: "multiple_choice",
        points: 1,
        options: [
          { option_text: "", is_correct: true, order_index: 0 },
          { option_text: "", is_correct: false, order_index: 1 }
        ]
      });
    }
  }, [question, isOpen]);

  const handleQuestionTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData({ ...formData, question_text: e.target.value });
  };

  const handleQuestionTypeChange = (value: "multiple_choice" | "true_false") => {
    let options: QuestionOption[];
    if (value === "true_false") {
      options = [
        { option_text: "Verdadeiro", is_correct: true, order_index: 0 },
        { option_text: "Falso", is_correct: false, order_index: 1 }
      ];
    } else if (formData.question_type === "true_false") {
      options = [
        { option_text: "", is_correct: true, order_index: 0 },
        { option_text: "", is_correct: false, order_index: 1 }
      ];
    } else {
      options = formData.options;
    }
    setFormData({ ...formData, question_type: value, options });
  };

  const handlePointsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const points = parseInt(e.target.value, 10);
    setFormData({ ...formData, points: isNaN(points) ? 1 : points });
  };

  const handleOptionTextChange = (index: number, text: string) => {
    const newOptions = [...formData.options];
    newOptions[index].option_text = text;
    setFormData({ ...formData, options: newOptions });
  };

  const handleCorrectOptionChange = (index: number) => {
    const newOptions = formData.options.map((opt, i) => ({
      ...opt,
      is_correct: i === index
    }));
    setFormData({ ...formData, options: newOptions });
  };

  const addOption = () => {
    if (formData.options.length >= 6) return;
    setFormData({
      ...formData,
      options: [
        ...formData.options,
        {
          option_text: "",
          is_correct: false,
          order_index: formData.options.length
        }
      ]
    });
  };

  const removeOption = (index: number) => {
    if (formData.options.length <= 2) return;
    const filtered = formData.options.filter((_, i) => i !== index);
    const reordered = filtered.map((opt, i) => ({
      ...opt,
      order_index: i,
      is_correct: i === 0 ? true : opt.is_correct
    }));
    setFormData({ ...formData, options: reordered });
  };

  const handleSave = () => {
    if (!formData.question_text.trim()) return;
    if (!formData.options.some((o) => o.is_correct)) return;
    if (formData.options.some((o) => !o.option_text.trim())) return;
    onSave(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{question ? "Editar Questão" : "Nova Questão"}</DialogTitle>
          <DialogDescription>
            {question ? "Modifique os detalhes da questão." : "Adicione uma nova questão à prova."}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="question-text">Texto da Questão</Label>
            <Textarea
              id="question-text"
              value={formData.question_text}
              onChange={handleQuestionTextChange}
              placeholder="Digite o enunciado da questão..."
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="question-type">Tipo de Questão</Label>
              <Select value={formData.question_type} onValueChange={handleQuestionTypeChange}>
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
                value={formData.points}
                onChange={handlePointsChange}
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label>Opções de Resposta</Label>
              {formData.question_type === "multiple_choice" && (
                <Button type="button" variant="outline" size="sm" onClick={addOption} disabled={formData.options.length >= 6}>
                  <Plus className="h-4 w-4 mr-1" />Adicionar Opção
                </Button>
              )}
            </div>

            <div className="space-y-3 mt-2">
              <RadioGroup value={formData.options.findIndex((opt) => opt.is_correct).toString()}>
                {formData.options.map((option, index) => (
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
                        disabled={formData.question_type === "true_false"}
                      />
                    </div>
                    {formData.question_type === "multiple_choice" && formData.options.length > 2 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeOption(index)} className="text-destructive">
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
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleSave}>{question ? "Atualizar Questão" : "Adicionar Questão"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
