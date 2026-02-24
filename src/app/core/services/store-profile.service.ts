import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase.service';
import { AuthService } from './auth.service';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap, catchError, filter, map } from 'rxjs/operators';
import { of, from } from 'rxjs';

export interface Store {
  id: string;
  user_id: string;
  name: string;
  slug: string;
  phone?: string;
  description?: string;
  is_open?: boolean;
  prep_time?: string;
  delivery_fee?: number;
  min_order_value?: number;
  pix_key?: string;
  logo_url?: string;
  cover_url?: string;
  created_at?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StoreProfileService {
  private supabaseService = inject(SupabaseService);
  private authService = inject(AuthService);
  private supabase = this.supabaseService.supabaseClient;

  // Signal for the current store state
  private _currentStore = signal<Store | null>(null);
  readonly currentStore = this._currentStore.asReadonly();
  
  // Computed values for easier access in templates
  readonly storeName = computed(() => this._currentStore()?.name || 'YAMI');
  readonly storeLogo = computed(() => this._currentStore()?.logo_url);
  readonly storeCover = computed(() => this._currentStore()?.cover_url);
  readonly isOpen = computed(() => this._currentStore()?.is_open ?? false);

  constructor() {
    // Automatically load store when user authenticates
    this.authService.user$.pipe(
      filter(user => !!user),
      switchMap(() => this.loadStoreProfile())
    ).subscribe();
  }

  loadStoreProfile() {
    return from(this.supabase
      .from('stores')
      .select('*')
      .limit(1)
      .maybeSingle()
    ).pipe(
      map(({ data, error }) => {
        if (error) throw error;
        return data as Store | null;
      }),
      tap(store => {
        if (store) {
          this._currentStore.set(store);
        }
      }),
      catchError(err => {
        console.error('Error loading store profile:', err);
        return of(null);
      })
    );
  }

  async updateStoreProfile(data: Partial<Store>) {
    const current = this._currentStore();
    if (!current) throw new Error('No active store to update');

    // Optimistic Update
    this._currentStore.update(store => store ? { ...store, ...data } : null);

    const { data: updated, error } = await this.supabase
      .from('stores')
      .update(data)
      .eq('id', current.id)
      .select()
      .single();

    if (error) {
      // Rollback on error
      this._currentStore.set(current);
      throw error;
    }

    // Confirm update with server data
    this._currentStore.set(updated as Store);
    return updated;
  }

  async uploadStoreImage(file: File | Blob, type: 'logo' | 'cover'): Promise<string> {
    const store = this._currentStore();
    if (!store) throw new Error('No active store');

    const fileName = `${store.id}/${type}-${Date.now()}.webp`;
    const bucket = 'store-assets';

    // Conversão de segurança Blob -> File para garantir suporte no Supabase
    let uploadFile: File | Blob = file;
    if (file instanceof Blob && !(file instanceof File)) {
       uploadFile = new File([file], fileName, { type: 'image/webp' });
    }

    console.log('Objeto para upload é um Blob/File válido?', uploadFile instanceof Blob, uploadFile);

    const { error: uploadError } = await this.supabase.storage
      .from(bucket)
      .upload(fileName, uploadFile, {
        upsert: true,
        contentType: 'image/webp',
        cacheControl: '3600'
      });

    if (uploadError) {
      console.error('Supabase Upload Error:', uploadError);
      throw uploadError;
    }

    const { data } = this.supabase.storage
      .from(bucket)
      .getPublicUrl(fileName);

    const publicUrl = data.publicUrl;

    // Update DB
    const fieldToUpdate = type === 'logo' ? 'logo_url' : 'cover_url';
    
    const { error: dbError } = await this.supabase
        .from('stores')
        .update({ [fieldToUpdate]: publicUrl })
        .eq('id', store.id);

    if (dbError) throw dbError;

    // Update Signal (Optimistic/Immediate)
    this._currentStore.update(store => {
        if (!store) return null;
        return {
            ...store,
            [fieldToUpdate]: publicUrl
        };
    });

    return publicUrl;
  }
}
