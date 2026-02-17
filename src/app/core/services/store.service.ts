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
        console.log('StoreService: fetchStore data:', data);
        if (error) {
          console.error('StoreService: fetchStore error:', error);
          throw error;
         }
        // maybeSingle returns null if no rows found, which is what we want
        return data as Store | null;
      }),
      tap(store => {
          console.log('StoreService: store found:', store);
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
      .select() // Retorna o objeto criado
      .single();

    if (error) throw error;

    this._currentStore.next(store as Store);
    return store;
  }
}
