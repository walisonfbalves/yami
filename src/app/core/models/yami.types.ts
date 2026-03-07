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
  min_choices: number;
  max_choices: number;
  required: boolean;
  sort_order: number;
  price_type?: 'sum' | 'max_price';
  items: AddonItem[];
}

export interface SelectedAddon {
  item: AddonItem;
  groupName: string;
  groupPriceType?: 'sum' | 'max_price';
}

export interface CartItem extends Product {
  quantity: number;
  addons?: SelectedAddon[];
  observations?: string;
  cartItemId?: string;
}

export interface LocalOptionItem {
  name: string;
  price: number;
}

export interface LocalOptionGroup {
  name: string;
  min: number;
  max: number;
  required: boolean;
  price_type?: 'sum' | 'max_price';
  options: LocalOptionItem[];
}
