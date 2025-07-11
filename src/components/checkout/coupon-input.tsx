"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2, Ticket, X } from "lucide-react";
import { toast } from "sonner";
import { validateCoupon } from "@/lib/coupon-service";

interface CouponInputProps {
  userId: string;
  courseIds: string[];
  totalAmount: number;
  companyId?: string;
  onCouponApplied: (discount: number, newTotal: number, couponCode: string) => void;
  onCouponRemoved: () => void;
}

export function CouponInput({
  userId,
  courseIds,
  totalAmount,
  companyId,
  onCouponApplied,
  onCouponRemoved
}: CouponInputProps) {
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [isValidating, setIsValidating] = useState(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [isValid, setIsValid] = useState<boolean | null>(null);
  
  const handleApplyCoupon = () => {
    if (!couponCode.trim()) {
      toast.error("Por favor, insira um código de cupom.");
      return;
    }
    
    setIsValidating(true);
    setValidationMessage(null);
    setIsValid(null);
    
    try {
      // Validar o cupom
      const validation = validateCoupon(
        couponCode,
        userId,
        courseIds,
        totalAmount,
        companyId
      );
      
      setIsValidating(false);
      
      if (!validation.isValid) {
        setIsValid(false);
        setValidationMessage(validation.message || "Cupom inválido.");
        toast.error(validation.message || "Cupom inválido.");
        return;
      }
      
      // Cupom válido
      setIsValid(true);
      setAppliedCoupon(couponCode);
      setAppliedDiscount(validation.appliedDiscount || 0);
      setValidationMessage(validation.message || "Cupom aplicado com sucesso!");
      
      // Calcular novo total
      const newTotal = Math.max(0, totalAmount - (validation.appliedDiscount || 0));
      
      // Notificar o componente pai
      onCouponApplied(validation.appliedDiscount || 0, newTotal, couponCode);
      
      toast.success(validation.message || "Cupom aplicado com sucesso!");
      
      // Limpar o campo de entrada
      setCouponCode("");
    } catch (error) {
      console.error("Erro ao validar cupom:", error);
      setIsValidating(false);
      setIsValid(false);
      setValidationMessage("Erro ao validar o cupom. Tente novamente.");
      toast.error("Erro ao validar o cupom. Tente novamente.");
    }
  };
  
  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setAppliedDiscount(0);
    setValidationMessage(null);
    setIsValid(null);
    
    // Notificar o componente pai
    onCouponRemoved();
    
    toast.info("Cupom removido.");
  };
  
  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Ticket className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Inserir código do cupom"
                className="pl-9"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                disabled={!!appliedCoupon}
              />
            </div>
            
            {!appliedCoupon ? (
              <Button 
                onClick={handleApplyCoupon} 
                disabled={!couponCode.trim() || isValidating}
                className="min-w-20"
              >
                {isValidating ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Aplicar"
                )}
              </Button>
            ) : (
              <Button 
                variant="outline" 
                onClick={handleRemoveCoupon}
                className="min-w-20"
              >
                Remover
              </Button>
            )}
          </div>
          
          {appliedCoupon && (
            <div className="p-3 bg-primary/10 rounded-md flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <Check className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium">{appliedCoupon}</p>
                  <p className="text-xs text-muted-foreground">
                    Desconto de R$ {appliedDiscount.toFixed(2)} aplicado
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={handleRemoveCoupon} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          {validationMessage && !appliedCoupon && (
            <div className={`p-3 ${isValid ? 'bg-green-100' : 'bg-red-100'} rounded-md`}>
              <p className={`text-sm ${isValid ? 'text-green-800' : 'text-red-800'}`}>
                {validationMessage}
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}