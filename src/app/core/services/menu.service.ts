import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { StoreService } from './store.service';
import { BehaviorSubject, Observable, from, of, combineLatest } from 'rxjs';
import { map, switchMap, tap, catchError, take } from 'rxjs/operators';

export interface Category {
  id: string;
  store_id: string;
  name: string;
  sort_order: number;
  created_at?: string;
}

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

export interface MenuData {
  categories: Category[];
  products: Product[];
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private supabase = inject(SupabaseService).supabaseClient;
  private storeService = inject(StoreService);

  private _categories = new BehaviorSubject<Category[]>([]);
  readonly categories$ = this._categories.asObservable();

  private _products = new BehaviorSubject<Product[]>([]);
  readonly products$ = this._products.asObservable();

  private _loading = new BehaviorSubject<boolean>(true);
  readonly loading$ = this._loading.asObservable();

  constructor() {
    // Constructor logic removed to avoid side-effects.
    // Components should explicitly call fetchMenu via subscription.
  }

  fetchMenu(storeId: string): Observable<MenuData> {
    const categoriesQuery = this.supabase
      .from('categories')
      .select('*')
      .eq('store_id', storeId)
      .order('sort_order', { ascending: true });

    const productsQuery = this.supabase
      .from('products')
      .select('*')
      .eq('store_id', storeId)
      .order('sort_order', { ascending: true });

    return combineLatest([
      from(categoriesQuery),
      from(productsQuery)
    ]).pipe(
      map(([categoriesRes, productsRes]) => {
        if (categoriesRes.error) throw categoriesRes.error;
        if (productsRes.error) throw productsRes.error;

        const categories = categoriesRes.data as Category[];
        const products = productsRes.data as Product[];

        this._categories.next(categories);
        this._products.next(products);
        this._loading.next(false); // Dados carregados
        
        return { categories, products };
      }),
      catchError(err => {
        console.error('Erro ao buscar cardápio:', err);
        this._loading.next(false); // Erro também finaliza loading
        return of({ categories: [], products: [] });
      })
    );
  }

  // --- Categories ---

  async createCategory(name: string) {
    const store = await this.getCurrentStore();
    const { data, error } = await this.supabase
      .from('categories')
      .insert({
        store_id: store.id,
        name,
        sort_order: this._categories.value.length // Add to end
      })
      .select()
      .single();

    if (error) throw error;
    
    const currentlist = this._categories.value;
    this._categories.next([...currentlist, data as Category]);
    return data;
  }

  async updateCategory(id: string, updates: Partial<Category>) {
    const { data, error } = await this.supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const currentlist = this._categories.value;
    const index = currentlist.findIndex(c => c.id === id);
    if (index !== -1) {
      currentlist[index] = data as Category;
      this._categories.next([...currentlist]);
    }
    return data;
  }

  async deleteCategory(id: string) {
    const { error } = await this.supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;

    const currentlist = this._categories.value.filter(c => c.id !== id);
    this._categories.next(currentlist);
    
    // Also remove products from local state? 
    // Ideally user should re-fetch or we filter locally. 
    // Supabase cascade delete handles DB, let's update local state
    const currentProducts = this._products.value.filter(p => p.category_id !== id);
    this._products.next(currentProducts);
  }

  // --- Products ---

  async createProduct(product: Omit<Product, 'id' | 'store_id' | 'created_at'>) {
    const store = await this.getCurrentStore();
    const { data, error } = await this.supabase
      .from('products')
      .insert({
        ...product,
        store_id: store.id
      })
      .select()
      .single();

    if (error) throw error;

    const currentlist = this._products.value;
    this._products.next([...currentlist, data as Product]);
    return data;
  }

  async updateProduct(id: string, updates: Partial<Product>) {
    const { data, error } = await this.supabase
      .from('products')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const currentlist = this._products.value;
    const index = currentlist.findIndex(p => p.id === id);
    if (index !== -1) {
      currentlist[index] = data as Product;
      this._products.next([...currentlist]);
    }
    return data;
  }

  async deleteProduct(id: string) {
    const { error } = await this.supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;

    const currentlist = this._products.value.filter(p => p.id !== id);
    this._products.next(currentlist);
  }

  // --- Image Upload ---

  async uploadImage(file: File): Promise<string> {
    const store = await this.getCurrentStore();
    const fileExt = file.name.split('.').pop();
    const fileName = `${store.id}/${Date.now()}.${fileExt}`;

    const { error: uploadError } = await this.supabase.storage
      .from('menu-images')
      .upload(fileName, file);

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from('menu-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  private async getCurrentStore() {
    const store = await this.storeService.currentStore$.pipe(take(1)).toPromise();
    if (!store) throw new Error('Loja não encontrada');
    return store;
  }
}
