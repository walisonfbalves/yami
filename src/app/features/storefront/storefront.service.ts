import { Injectable, inject } from '@angular/core';
import { SupabaseService } from '../../core/services/supabase.service';
import { Store } from '../../core/services/store.service';
import { Category, Product } from '../../core/services/menu.service';

export interface PublicMenuData {
  categories: Category[];
  products: Product[];
}

@Injectable({ providedIn: 'root' })
export class StorefrontService {
  private supabase = inject(SupabaseService).supabaseClient;

  async fetchStoreBySlug(slug: string): Promise<Store | null> {
    const { data, error } = await this.supabase
      .from('stores')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error) {
      console.error('StorefrontService: erro ao buscar loja:', error);
      return null;
    }
    return data as Store | null;
  }

  async fetchPublicMenu(storeId: string): Promise<PublicMenuData> {
    const [categoriesRes, productsRes] = await Promise.all([
      this.supabase
        .from('categories')
        .select('*')
        .eq('store_id', storeId)
        .order('sort_order', { ascending: true }),
      this.supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .eq('is_available', true)
        .order('sort_order', { ascending: true }),
    ]);

    return {
      categories: (categoriesRes.data ?? []) as Category[],
      products: (productsRes.data ?? []) as Product[],
    };
  }
}
