export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  categoryId: string;
}

export interface Category {
  id: string;
  name: string;
}

export interface Restaurant {
  name: string;
  bannerUrl: string;
  logoUrl: string;
}

export interface MenuData {
  restaurant: Restaurant;
  categories: Category[];
  products: Product[];
}
