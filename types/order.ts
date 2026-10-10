/**
 * Order types mirroring vieguard-back prisma/schema.prisma.
 * Decimal columns are serialized as strings and BigInt ids as strings.
 */
import { Product, ProductVariant } from './product';

export type OrderType = 'beli' | 'sewa' | 'custom';
export type OrderStatus = 'pending' | 'dikonfirmasi' | 'diproses' | 'siap_diambil' | 'selesai' | 'dibatalkan';
export type RentalStatus = 'dipesan' | 'diambil' | 'dikembalikan' | 'terlambat';
export type PaymentType = 'dp' | 'pelunasan' | 'refund';
export type PaymentStatus = 'menunggu' | 'terverifikasi' | 'ditolak';

export interface Accessory {
  id: string;
  name: string;
  description?: string | null;
  price: string;
  stock: number;
  imageUrl?: string | null;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemType: 'product' | 'accessory';
  productId?: string | null;
  productVariantId?: string | null;
  accessoryId?: string | null;
  quantity: number;
  size?: string | null;
  unitPrice: string;
  subtotal: string;
  product?: Product | null;
  productVariant?: ProductVariant | null;
  accessory?: Accessory | null;
}

export interface CustomOrderDetail {
  id: string;
  orderId: string;
  designReference?: string | null;
  designDescription?: string | null;
  jenisJenjang?: string | null;
  consultationNote?: string | null;
}

export interface Rental {
  id: string;
  orderId: string;
  pickupDate: string;
  returnDate: string;
  actualReturnDate?: string | null;
  pickupTime?: string | null;
  returnTime?: string | null;
  depositAmount?: string | null;
  penaltyAmount?: string | null;
  refundStatus?: string | null;
  status: RentalStatus;
}

export interface Payment {
  id: string;
  orderId: string;
  paymentType: PaymentType;
  amount: string;
  paymentMethod?: string | null;
  proofImage?: string | null;
  status: PaymentStatus;
  createdAt: string;
}

export interface OrderStatusHistory {
  id: string;
  orderId: string;
  progressPercentage: number;
  statusLabel: string;
  note?: string | null;
  createdAt: string;
}

export interface OrderPhoto {
  id: string;
  category: string;
  title?: string | null;
  imageUrl: string;
  createdAt: string;
}

export interface Order {
  id: string;
  userId: string;
  orderNumber: string;
  orderType: OrderType;
  requiresProduction: boolean;
  status: OrderStatus;
  totalPrice: string;
  dpAmount?: string | null;
  isLunas: boolean;
  deadlineDate?: string | null;
  expiredAt?: string | null;
  notes?: string | null;
  courier?: string | null;
  trackingNumber?: string | null;
  shippingCost?: string | null;
  shippedAt?: string | null;
  etaDate?: string | null;
  createdAt: string;
  updatedAt: string;
  items: OrderItem[];
  customOrderDetail?: CustomOrderDetail | null;
  rental?: Rental | null;
  payments?: Payment[];
  statusHistory?: OrderStatusHistory[];
  /** Not included by the website API yet; rendered when present. */
  orderPhotos?: OrderPhoto[];
}

export interface CreateOrderItemPayload {
  itemType: 'product' | 'accessory';
  productId?: string;
  productVariantId?: string;
  accessoryId?: string;
  quantity: number;
  size?: string;
  unitPrice: number;
}

export interface CreateOrderPayload {
  orderType: OrderType;
  requiresProduction?: boolean;
  notes?: string;
  items: CreateOrderItemPayload[];
  rentalDetail?: { pickupDate: string; returnDate: string };
  customDetail?: {
    designReference?: string;
    designDescription?: string;
    jenisJenjang?: string;
    consultationNote?: string;
  };
}
