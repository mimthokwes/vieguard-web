import { Product, ProductVariant } from './product';

export type TransactionType = 'RENTAL' | 'BUY';

export interface CartItem {
  id: string;
  productId: string | bigint;
  product: Product;
  variantId?: string | bigint | null;
  variant?: ProductVariant | null;
  transactionType: TransactionType;
  rentDurationDays?: 3 | 5 | 7;
  startDate?: string;
  endDate?: string;
  size?: string;
  quantity: number;
  unitPrice: number;
  depositAmount: number;
  hasSilkProtection?: boolean;
  silkProtectionPrice?: number;
  shippingMethod?: string;
  shippingFee?: number;
}

export interface OrderSummary {
  subtotal: number;
  shippingFee: number;
  protectionFee: number;
  depositTotal: number;
  totalPayment: number;
}

export interface OrderItem {
  id: string | bigint;
  orderId: string | bigint;
  productId: string | bigint;
  product?: Product;
  variantId?: string | bigint | null;
  transactionType: TransactionType;
  rentalDurationDays?: number;
  startDate?: string;
  endDate?: string;
  quantity: number;
  price: number;
  depositPrice: number;
}

export interface Order {
  id: string | bigint;
  orderCode: string;
  userId: string | bigint;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'COMPLETED' | 'CANCELLED';
  totalAmount: number;
  depositAmount: number;
  shippingFee: number;
  protectionFee: number;
  recipientName: string;
  recipientPhone: string;
  shippingAddress: string;
  items: OrderItem[];
  createdAt: string;
}
