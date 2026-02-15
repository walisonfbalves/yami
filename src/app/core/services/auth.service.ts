import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Session, User, AuthError } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService).client;
  private router = inject(Router);

  private _session = new BehaviorSubject<Session | null>(null);
  readonly session$ = this._session.asObservable();

  private _user = new BehaviorSubject<User | null>(null);
  readonly user$ = this._user.asObservable();

  constructor() {
    // Carrega sessão inicial
    this.supabase.auth.getSession().then(({ data }) => {
      this._session.next(data.session);
      this._user.next(data.session?.user ?? null);
    });

    // Escuta mudanças na autenticação
    this.supabase.auth.onAuthStateChange((_event, session) => {
      this._session.next(session);
      this._user.next(session?.user ?? null);

      if (_event === 'SIGNED_OUT') {
        this.router.navigate(['/auth/login']);
      }
    });

    // Debug para desenvolvimento
    this.session$.subscribe(session => {
      console.log('AuthService: Sessão atualizada', session?.user?.email ?? 'Sem sessão');
    });
  }

  get currentUser(): User | null {
    return this._session.value?.user ?? null;
  }

  get currentSession(): Session | null {
    return this._session.value;
  }

  async signIn(identifier: string, password: string) {
    // Reutiliza a lógica de login híbrido do SupabaseService, mas agora centralizada
    // Precisamos acessar o método signIn do SupabaseService, não do client diretamente
    // Porém, como injetamos o 'client' acima, vamos precisar injetar o service completo
    // ou mover a lógica de "identifier" para cá.
    // Vamos usar o SupabaseService injetado.
    
    // Pequeno ajuste: injetar o serviço inteiro, não só o client
    return inject(SupabaseService).signIn(identifier, password);
  }

  async signUp(email: string, password: string, data: { name: string; username: string; }) {
    return inject(SupabaseService).signUp(email, password, data);
  }

  async signOut() {
    return this.supabase.auth.signOut();
  }
  
  isAuthenticated(): boolean {
    return !!this._session.value;
  }
}
