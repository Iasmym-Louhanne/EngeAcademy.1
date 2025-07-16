"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CouponInput } from "@/components/checkout/coupon-input";
import { toast } from "sonner";
import { getCourseById, type Course } from "@/lib/course-service";
import { useAuth } from "@/contexts/auth-context";
import { checkCompanyCoupon } from "@/lib/coupon-service";
import { ChevronLeft, CreditCard, ShoppingCart } from "lucide-react";

function CheckoutContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const courseId = searchParams.get("course");
  
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<"credit-card" | "pix" | "boleto">("credit-card");
  const [subtotal, setSubtotal] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [total, setTotal] = useState(0);
  const [appliedCouponCode, setAppliedCouponCode] = useState<string | null>(null);
  const [companyCoupon, setCompanyCoupon] = useState<any>(null);
  
  // Carregar curso selecionado
  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      try {
        const course = await getCourseById(courseId);
        if (course) {
          setSelectedCourse(course);
          const initialSubtotal = (course.price || 0) * quantity;
          setSubtotal(initialSubtotal);
          setTotal(initialSubtotal);
        }
      } catch (err) {
        console.error('Erro ao carregar curso:', err);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Aplicar cupom da empresa automaticamente quando disponível
  useEffect(() => {
    if (
      selectedCourse &&
      user?.organizationType === 'empresa' &&
      user.organizationId
    ) {
      const coupon = checkCompanyCoupon(user.organizationId);
      if (coupon) {
        setCompanyCoupon(coupon);
        const currentSubtotal = (selectedCourse.price || 0) * quantity;
        let companyDiscount = 0;

        if (coupon.discountType === 'percentage') {
          companyDiscount = (currentSubtotal * coupon.discountValue) / 100;
        } else {
          companyDiscount = Math.min(currentSubtotal, coupon.discountValue);
        }

        setDiscount(companyDiscount);
        setTotal(Math.max(0, currentSubtotal - companyDiscount));
        setAppliedCouponCode(coupon.code);
      }
    }
  }, [selectedCourse, user, quantity]);
  
  // Atualizar subtotal quando a quantidade mudar
  useEffect(() => {
    if (selectedCourse) {
      const newSubtotal = (selectedCourse.price || 0) * quantity;
      setSubtotal(newSubtotal);

      // Recalcular o desconto se houver cupom aplicado
      if (companyCoupon) {
        let newDiscount = 0;

        if (companyCoupon.discountType === 'percentage') {
          newDiscount = (newSubtotal * companyCoupon.discountValue) / 100;
        } else {
          newDiscount = Math.min(newSubtotal, companyCoupon.discountValue);
        }

        setDiscount(newDiscount);
        setTotal(Math.max(0, newSubtotal - newDiscount));
      } else {
        setTotal(newSubtotal - discount);
      }
    }
  }, [quantity, selectedCourse, companyCoupon]);
  
  // Lidar com a aplicação de cupom
  const handleCouponApplied = (discountAmount: number, newTotal: number, couponCode: string) => {
    setDiscount(discountAmount);
    setTotal(newTotal);
    setAppliedCouponCode(couponCode);
  };
  
  // Lidar com a remoção de cupom
  const handleCouponRemoved = () => {
    setDiscount(0);
    setTotal(subtotal);
    setAppliedCouponCode(null);
    
    // Se o usuário tiver um cupom de empresa, aplicá-lo novamente
    if (user?.organizationType === 'empresa' && user.organizationId) {
      const coupon = checkCompanyCoupon(user.organizationId);
      if (coupon) {
        setCompanyCoupon(coupon);
        
        let companyDiscount = 0;
        if (coupon.discountType === 'percentage') {
          companyDiscount = (subtotal * coupon.discountValue) / 100;
        } else {
          companyDiscount = Math.min(subtotal, coupon.discountValue);
        }
        
        setDiscount(companyDiscount);
        setTotal(Math.max(0, subtotal - companyDiscount));
        setAppliedCouponCode(coupon.code);
      }
    }
  };
  
  // Finalizar a compra com Stripe
  const handleCheckout = async () => {
    if (!selectedCourse) return;

    try {
      const res = await fetch("/api/stripe/create-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selectedCourse.id,
          quantity,
          successUrl: `${window.location.origin}/dashboard`,
          cancelUrl: `${window.location.origin}/checkout?course=${selectedCourse.id}`
        })
      });

      const data = await res.json();

      if (data.url) {
        window.location.href = data.url as string;
      } else {
        toast.error("Não foi possível iniciar o pagamento.");
      }
    } catch (err) {
      console.error("Stripe checkout error", err);
      toast.error("Erro ao iniciar pagamento.");
    }
  };
  
  if (!selectedCourse) {
    return (
      <div className="container py-12">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold mb-4">Curso não encontrado</h1>
          <p className="text-muted-foreground mb-6">
            O curso selecionado não foi encontrado. Por favor, selecione um curso válido.
          </p>
          <Link href="/cursos">
            <Button>Ver cursos disponíveis</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <Link href="/cursos" className="flex items-center text-primary hover:underline">
            <ChevronLeft className="h-4 w-4 mr-1" />
            Voltar para cursos
          </Link>
          <h1 className="text-3xl font-bold mt-4">Finalizar Compra</h1>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Resumo do pedido */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Resumo do Pedido
                </CardTitle>
                <CardDescription>
                  Revise os itens do seu carrinho antes de finalizar
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b pb-4">
                    <div>
                      <h3 className="font-medium">{selectedCourse.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {selectedCourse.duration || 'Duração não especificada'}
                      </p>
                    </div>
                    <div className="flex items-center gap-4 mt-2 sm:mt-0">
                      <div className="flex items-center border rounded-md">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                          disabled={quantity <= 1}
                        >
                          -
                        </Button>
                        <span className="w-8 text-center">{quantity}</span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-none"
                          onClick={() => setQuantity(quantity + 1)}
                        >
                          +
                        </Button>
                      </div>
                      <div className="text-right min-w-20">
                        <p className="font-medium">
                          R$ {((selectedCourse.price || 0) * quantity).toFixed(2)}
                        </p>
                        {quantity > 1 && (
                          <p className="text-xs text-muted-foreground">
                            (R$ {(selectedCourse.price || 0).toFixed(2)} cada)
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <h3 className="font-medium mb-2">Cupom de Desconto</h3>
                    <CouponInput
                      userId={user?.id || "guest"}
                      courseIds={[selectedCourse.id]}
                      totalAmount={subtotal}
                      companyId={user?.organizationId}
                      onCouponApplied={handleCouponApplied}
                      onCouponRemoved={handleCouponRemoved}
                    />
                    
                    {companyCoupon && !appliedCouponCode && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm text-blue-800">
                          <span className="font-medium">Cupom empresarial disponível!</span> {' '}
                          {companyCoupon.discountType === 'percentage' 
                            ? `${companyCoupon.discountValue}% de desconto` 
                            : `R$ ${companyCoupon.discountValue.toFixed(2)} de desconto`
                          } para a sua empresa.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Resumo de valores e pagamento */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Resumo</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                  </div>
                  
                  {discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Desconto {appliedCouponCode && `(${appliedCouponCode})`}</span>
                      <span>- R$ {discount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <Separator className="my-2" />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>
                
                <div className="mt-6 space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">Forma de Pagamento</h3>
                    <RadioGroup 
                      defaultValue="credit-card" 
                      value={paymentMethod}
                      onValueChange={(value: "credit-card" | "pix" | "boleto") => setPaymentMethod(value)}
                    >
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="credit-card" id="credit-card" />
                        <Label htmlFor="credit-card" className="flex-1 cursor-pointer">Cartão de Crédito</Label>
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="pix" id="pix" />
                        <Label htmlFor="pix" className="flex-1 cursor-pointer">PIX</Label>
                        <div className="text-sm font-medium text-green-600">PIX</div>
                      </div>
                      <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-muted/50">
                        <RadioGroupItem value="boleto" id="boleto" />
                        <Label htmlFor="boleto" className="flex-1 cursor-pointer">Boleto Bancário</Label>
                        <div className="text-sm font-mono">|||</div>
                      </div>
                    </RadioGroup>
                  </div>
                  
                  {paymentMethod === "credit-card" && (
                    <div className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="card-number">Número do Cartão</Label>
                        <Input id="card-number" placeholder="0000 0000 0000 0000" />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor="expiry">Validade</Label>
                          <Input id="expiry" placeholder="MM/AA" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="cvv">CVV</Label>
                          <Input id="cvv" placeholder="123" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="card-name">Nome no Cartão</Label>
                        <Input id="card-name" placeholder="NOME COMO IMPRESSO NO CARTÃO" />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full"
                  size="lg"
                  onClick={handleCheckout}
                >
                  Finalizar Compra
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutContent />
    </Suspense>
  );
}
