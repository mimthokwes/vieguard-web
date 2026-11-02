export interface TestimonialOrderItem {
  size?: string | null;
  quantity: number;
  product?: { name: string } | null;
  accessory?: { name: string } | null;
}

export interface TestimonialOrder {
  id: string;
  orderNumber: string;
  orderType: 'beli' | 'sewa' | 'custom';
  createdAt: string;
  items: TestimonialOrderItem[];
}

export interface TestimonialUser {
  name: string;
  profilePhoto?: string | null;
}

export interface Testimonial {
  id: string;
  userId: string;
  orderId?: string | null;
  rating: number;
  comment?: string | null;
  isFeatured: boolean;
  createdAt: string;
  user?: TestimonialUser;
  order?: TestimonialOrder | null;
}
