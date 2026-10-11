/** Product types mirroring vieguard-back prisma/schema.prisma (Decimal → string, BigInt → string). */

export interface ProductCategory {
  id: string;
  name: string;
  description?: string | null;
}

export interface ProductVariant {
  id: string;
  productId: string;
  size: string;
  stockBuy: number;
  stockRent: number;
  priceBuyOverride?: string | null;
  priceRentOverride?: string | null;
  stockInService?: number;
}

export interface ProductImage {
  id: string;
  productId: string;
  imageUrl: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  categoryId: string;
  category?: ProductCategory;
  name: string;
  description?: string | null;
  basePriceBuy?: string | null;
  basePriceRent?: string | null;
  isCustomAvailable: boolean;
  isVisible: boolean;
  sku?: string | null;
  conditionGrade?: string | null;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt?: string;
}

export interface ProductFilterQuery {
  categoryId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
}

export interface RentalAvailability {
  available?: boolean;
  availableStock: number;
  totalStock?: number;
  message?: string;
}
