export interface ProductCategory {
  id: string | bigint;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductVariant {
  id: string | bigint;
  productId: string | bigint;
  name: string; // e.g. "Size S", "Size M", "Color Red"
  size?: string | null;
  color?: string | null;
  stock: number;
  priceBuyDelta?: number;
  priceRent3dDelta?: number;
  priceRent5dDelta?: number;
  priceRent7dDelta?: number;
  isAvailable: boolean;
}

export interface ProductImage {
  id: string | bigint;
  productId: string | bigint;
  imageUrl: string;
  isPrimary?: boolean;
  displayOrder?: number;
}

export interface Product {
  id: string | bigint;
  categoryId: string | bigint;
  category?: ProductCategory;
  name: string;
  slug?: string;
  description: string;
  fabricComposition?: string | null;
  innerLining?: string | null;
  corsetryConstruct?: string | null;
  trainLength?: string | null;
  basePriceBuy: number;
  basePriceRent3d: number;
  basePriceRent5d: number;
  basePriceRent7d: number;
  depositAmount: number;
  hygieneStandard?: string | null;
  likesCount?: number;
  rating?: number;
  reviewCount?: number;
  badgeTag?: string | null; // e.g. "SEWA / BELI", "BEST SELLER", "KOLEKSI EKSKLUSIF"
  subCategoryTag?: string | null; // e.g. "GAUN & COUTURE", "PRIA FORMAL"
  isVisible: boolean;
  images: ProductImage[];
  variants: ProductVariant[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductFilterQuery {
  categoryId?: string;
  search?: string;
  minPrice?: string;
  maxPrice?: string;
  size?: string;
  sortBy?: string;
  transactionType?: string;
}
