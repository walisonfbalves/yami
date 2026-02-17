import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { BehaviorSubject, Observable, from, of } from 'rxjs';
import { tap, map, catchError, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  phone?: string;
  description?: string; // Was bio
  is_open?: boolean;
  prep_time?: string;
  delivery_fee?: number;
  min_order_value?: number; // Was min_order
  pix_key?: string;
  logo_url?: string;
  cover_url?: string; // Was banner_url
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private supabase = this.supabaseService.supabaseClient;

  private _currentStore = new BehaviorSubject<Store | null | undefined>(undefined);
  readonly currentStore$ = this._currentStore.asObservable();

  constructor() {
    // Tenta carregar a loja assim que o usuário logar
    this.authService.user$.pipe(
      switchMap(user => {
        if (user) {
          return this.fetchStore();
        } else {
          this._currentStore.next(null);
          return of(null);
        }
      })
    ).subscribe();
  }

  // Busca a loja do usuário logado
  fetchStore(): Observable<Store | null> {
    const query = this.supabase
      .from('stores')
      .select('*')
      .limit(1)
      .maybeSingle();

    return from(query).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('StoreService: fetchStore error:', error);
          throw error;
         }
        return data as Store | null;
      }),
      tap(store => {
          this._currentStore.next(store);
      }),
      catchError(err => {
        console.error('Erro ao buscar loja:', err);
        this._currentStore.next(null);
        return of(null);
      })
    );
  }

  // Cria uma nova loja
  async createStore(data: { name: string; slug: string; phone?: string }) {
    const user = this.authService.currentUser;
    if (!user) throw new Error('Usuário não autenticado');

    const { data: store, error } = await this.supabase
      .from('stores')
      .insert({
        ...data,
        user_id: user.id
      })
      .select()
      .single();

    if (error) throw error;

    this._currentStore.next(store as Store);
    return store;
  }

  // Atualiza a loja
  async updateStore(data: Partial<Store>) {
    const currentStore = this._currentStore.value;
    if (!currentStore) throw new Error('Nenhuma loja selecionada para atualizar');

    const { data: updatedStore, error } = await this.supabase
      .from('stores')
      .update(data)
      .eq('id', currentStore.id)
      .select()
      .single();

    if (error) throw error;

    this._currentStore.next(updatedStore as Store);
    return updatedStore;
  }

  // --- Image Upload ---

  async uploadLogo(file: File | Blob): Promise<string> {
    const store = this._currentStore.value;
    if (!store) throw new Error('Loja não encontrada');

    const fileName = `${store.id}/logo-${Date.now()}.webp`;

    const { error: uploadError } = await this.supabase.storage
      .from('store-images')
      .upload(fileName, file, {
        upsert: true,
        contentType: 'image/webp'
      });

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from('store-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  async uploadCover(file: File | Blob): Promise<string> {
    const store = this._currentStore.value;
    if (!store) throw new Error('Loja não encontrada');

    const fileName = `${store.id}/cover-${Date.now()}.webp`;

    const { error: uploadError } = await this.supabase.storage
      .from('store-images')
      .upload(fileName, file, {
        upsert: true,
        contentType: 'image/webp'
      });

    if (uploadError) throw uploadError;

    const { data } = this.supabase.storage
      .from('store-images')
      .getPublicUrl(fileName);

    return data.publicUrl;
  }
}
