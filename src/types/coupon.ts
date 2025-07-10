// Tipos de cupons
export type CouponType = 'company' | 'individual';

// Tipos de desconto
export type DiscountType = 'percentage' | 'fixed';

// Interface para cupons
export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  discountType: DiscountType;
  discountValue: number;
  companyId?: string;
  maxUses: number;
  usedCount: number;
  validFrom: Date;
  validUntil: Date;
  minPurchase?: number;
  applicableCourses?: string[]; // null/undefined significa todos os cursos
  isActive: boolean;
  createdAt: Date;
}

// Interface para uso de cupom
export interface CouponUsage {
  id: string;
  couponId: string;
  userId: string;
  orderId: string;
  appliedDiscount: number;
  usedAt: Date;
}

// Interface para validação de cupom
export interface CouponValidation {
  isValid: boolean;
  coupon?: Coupon;
  message?: string;
  appliedDiscount?: number;
}