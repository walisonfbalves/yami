import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { Observable, from, map } from 'rxjs';

export interface Category {
  id?: string;
  store_id?: string;
  name: string;
  sort_order?: number;
  created_at?: string;
}

export interface Product {
    id?: string;
    store_id?: string;
    category_id: string;
    name: string;
    description?: string;
    price: number;
    image_url?: string;
    is_available?: boolean;
    created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private supabase = inject(SupabaseService).supabaseClient;

  constructor() { }

  // Categories
  getCategories(storeId: string): Observable<Category[]> {
      return from(
          this.supabase
              .from('categories')
              .select('*')
              .eq('store_id', storeId)
              .order('sort_order', { ascending: true })
      ).pipe(
          map(({ data, error }) => {
              if (error) throw error;
              return data as Category[];
          })
      );
  }

  createCategory(category: Category): Observable<Category> {
      return from(
          this.supabase
              .from('categories')
              .insert(category)
              .select()
              .single()
      ).pipe(
          map(({ data, error }) => {
              if (error) throw error;
              return data as Category;
          })
      );
  }

  updateCategory(id: string, updates: Partial<Category>): Observable<Category> {
    return from(
        this.supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single()
    ).pipe(
        map(({ data, error }) => {
            if (error) throw error;
            return data as Category;
        })
    );
  }

  deleteCategory(id: string): Observable<void> {
    return from(
        this.supabase
            .from('categories')
            .delete()
            .eq('id', id)
    ).pipe(
        map(({ error }) => {
            if (error) throw error;
        })
    );
  }


  // Products
  getProducts(storeId: string, categoryId?: string): Observable<Product[]> {
      let query = this.supabase
          .from('products')
          .select('*')
          .eq('store_id', storeId);

      if (categoryId && categoryId !== 'Todos') {
          query = query.eq('category_id', categoryId);
      }

      return from(query).pipe(
          map(({ data, error }) => {
              if (error) throw error;
              return data as Product[];
          })
      );
  }

    createProduct(product: Product): Observable<Product> {
        return from(
            this.supabase
                .from('products')
                .insert(product)
                .select()
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Product;
            })
        );
    }

    updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
        return from(
            this.supabase
                .from('products')
                .update(updates)
                .eq('id', id)
                .select()
                .single()
        ).pipe(
            map(({ data, error }) => {
                if (error) throw error;
                return data as Product;
            })
        );
    }

    deleteProduct(id: string): Observable<void> {
        return from(
            this.supabase
                .from('products')
                .delete()
                .eq('id', id)
        ).pipe(
            map(({ error }) => {
                if (error) throw error;
            })
        );
    }

    async uploadImage(file: File): Promise<string> {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error } = await this.supabase.storage
            .from('menu-images')
            .upload(filePath, file);

        if (error) throw error;

        const { data } = this.supabase.storage
            .from('menu-images')
            .getPublicUrl(filePath);
        
        return data.publicUrl;
    }
}
