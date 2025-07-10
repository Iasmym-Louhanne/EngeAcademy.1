import { Coupon, CouponType, DiscountType, CouponValidation } from "@/types/coupon";
import { toast } from "sonner";

// Dados de exemplo de cupons
let coupons: Coupon[] = [
  {
    id: "coupon-1",
    code: "WELCOME20",
    type: "individual",
    discountType: "percentage",
    discountValue: 20,
    maxUses: 100,
    usedCount: 12,
    validFrom: new Date("2023-01-01"),
    validUntil: new Date("2023-12-31"),
    minPurchase: 0,
    isActive: true,
    createdAt: new Date("2023-01-01")
  },
  {
    id: "coupon-2",
    code: "CORP25",
    type: "company",
    discountType: "percentage",
    discountValue: 25,
    companyId: "company-1",
    maxUses: 1000,
    usedCount: 45,
    validFrom: new Date("2023-01-01"),
    validUntil: new Date("2023-12-31"),
    isActive: true,
    createdAt: new Date("2023-01-01")
  },
  {
    id: "coupon-3",
    code: "FIXDESC50",
    type: "individual",
    discountType: "fixed",
    discountValue: 50,
    maxUses: 50,
    usedCount: 10,
    validFrom: new Date("2023-06-01"),
    validUntil: new Date("2023-08-31"),
    minPurchase: 100,
    isActive: true,
    createdAt: new Date("2023-06-01")
  }
];

// Obter todos os cupons
export const getAllCoupons = (): Coupon[] => {
  return [...coupons].sort((a, b) => {
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

// Obter cupom por ID
export const getCouponById = (id: string): Coupon | undefined => {
  return coupons.find(coupon => coupon.id === id);
};

// Obter cupom por código
export const getCouponByCode = (code: string): Coupon | undefined => {
  return coupons.find(coupon => coupon.code.toLowerCase() === code.toLowerCase());
};

// Criar um novo cupom
export const createCoupon = (coupon: Omit<Coupon, 'id' | 'usedCount' | 'createdAt'>): Coupon => {
  const newCoupon: Coupon = {
    ...coupon,
    id: `coupon-${Date.now()}`,
    usedCount: 0,
    createdAt: new Date()
  };
  
  coupons.push(newCoupon);
  return newCoupon;
};

// Atualizar um cupom existente
export const updateCoupon = (id: string, couponData: Partial<Coupon>): Coupon | undefined => {
  const index = coupons.findIndex(coupon => coupon.id === id);
  
  if (index === -1) return undefined;
  
  coupons[index] = { ...coupons[index], ...couponData };
  return coupons[index];
};

// Excluir um cupom
export const deleteCoupon = (id: string): boolean => {
  const initialLength = coupons.length;
  coupons = coupons.filter(coupon => coupon.id !== id);
  return coupons.length < initialLength;
};

// Validar um cupom para um usuário e uma compra específica
export const validateCoupon = (
  code: string, 
  userId: string, 
  courseIds: string[], 
  totalAmount: number,
  companyId?: string
): CouponValidation => {
  const coupon = getCouponByCode(code);
  
  // Verificar se o cupom existe
  if (!coupon) {
    return { isValid: false, message: "Cupom não encontrado." };
  }
  
  // Verificar se o cupom está ativo
  if (!coupon.isActive) {
    return { isValid: false, message: "Este cupom está inativo." };
  }
  
  // Verificar se o cupom não ultrapassou o limite de usos
  if (coupon.usedCount >= coupon.maxUses) {
    return { isValid: false, message: "Este cupom atingiu o limite máximo de uso." };
  }
  
  // Verificar a validade do cupom
  const now = new Date();
  if (now < coupon.validFrom || now > coupon.validUntil) {
    return { isValid: false, message: "Este cupom está fora do período de validade." };
  }
  
  // Verificar o valor mínimo de compra
  if (coupon.minPurchase && totalAmount < coupon.minPurchase) {
    return { 
      isValid: false, 
      message: `Este cupom exige um valor mínimo de compra de R$ ${coupon.minPurchase.toFixed(2)}.`
    };
  }
  
  // Verificar se é um cupom de empresa e se o usuário pertence à empresa
  if (coupon.type === 'company') {
    if (!companyId || coupon.companyId !== companyId) {
      return { isValid: false, message: "Este cupom é exclusivo para uma empresa específica." };
    }
  }
  
  // Verificar se o cupom é aplicável aos cursos selecionados
  if (coupon.applicableCourses && coupon.applicableCourses.length > 0) {
    const hasApplicableCourse = courseIds.some(id => coupon.applicableCourses?.includes(id));
    if (!hasApplicableCourse) {
      return { isValid: false, message: "Este cupom não é válido para os cursos selecionados." };
    }
  }
  
  // Calcular o desconto
  let appliedDiscount = 0;
  if (coupon.discountType === 'percentage') {
    appliedDiscount = (totalAmount * coupon.discountValue) / 100;
  } else {
    appliedDiscount = Math.min(totalAmount, coupon.discountValue);
  }
  
  return {
    isValid: true,
    coupon,
    appliedDiscount,
    message: `Cupom aplicado com sucesso! Desconto de R$ ${appliedDiscount.toFixed(2)}.`
  };
};

// Aplicar um cupom a uma compra
export const applyCoupon = (
  code: string,
  userId: string,
  orderId: string,
  courseIds: string[],
  totalAmount: number,
  companyId?: string
): { success: boolean; newTotal?: number; message: string } => {
  const validation = validateCoupon(code, userId, courseIds, totalAmount, companyId);
  
  if (!validation.isValid) {
    return { success: false, message: validation.message || "Cupom inválido." };
  }
  
  // Cupom é válido, incrementar o contador de uso
  const coupon = validation.coupon!;
  updateCoupon(coupon.id, { usedCount: coupon.usedCount + 1 });
  
  // Calcular o novo total
  const newTotal = Math.max(0, totalAmount - validation.appliedDiscount!);
  
  return {
    success: true,
    newTotal,
    message: `Cupom ${code} aplicado com sucesso!`
  };
};

// Verificar se um usuário tem um cupom de empresa disponível
export const checkCompanyCoupon = (companyId: string): Coupon | undefined => {
  const now = new Date();
  
  return coupons.find(coupon => 
    coupon.type === 'company' &&
    coupon.companyId === companyId &&
    coupon.isActive &&
    coupon.usedCount < coupon.maxUses &&
    now >= coupon.validFrom &&
    now <= coupon.validUntil
  );
};