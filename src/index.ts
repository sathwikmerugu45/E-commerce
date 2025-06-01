export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  features?: string[];
  rating?: number;
  inStock: boolean;
}

export interface CartItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

export interface Category {
  id: number;
  name: string;
  slug: string;
}