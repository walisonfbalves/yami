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

export interface AddonItem {
  id: string;
  group_id: string;
  name: string;
  price: number;
  is_available: boolean;
  sort_order: number;
}

export interface AddonGroup {
  id: string;
  product_id: string;
  store_id: string;
  name: string;
  required: boolean;
  max_choices: number;
  sort_order: number;
  items: AddonItem[];
}

export interface SelectedAddon {
  item: AddonItem;
  groupName: string;
}

export interface CartItem extends Product {
  quantity: number;
  addons?: SelectedAddon[];
  observations?: string;
  cartItemId?: string;
}
