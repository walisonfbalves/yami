export interface Product {
  id: string;
  store_id: string;
  category_id: string;
  name: string;
  description?: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  sort_order: number;
  created_at?: string;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  sort_order: number;
  created_at?: string;
}

export interface CartItem extends Product {
  quantity: number;
}
