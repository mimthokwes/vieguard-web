export interface StoreStats {
  totalModels: number;
  totalPurchaseModels: number;
  totalRentalModels: number;
  totalCategories: number;
  totalOrdersCompleted: number;
  totalTestimonials: number;
}

export interface StoreProfile {
  id: string;
  storeName: string;
  description: string;
  address: string;
  phone: string;
  email?: string | null;
  whatsappNumber?: string | null;
  socialMedia?: string | null;
  logoImage?: string | null;
  operationalHours?: string | null;
  stats?: StoreStats;
}
