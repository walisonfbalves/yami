import { Injectable } from '@angular/core';
import { createClient, SupabaseClient, SupportedStorage } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

class CustomStorage implements SupportedStorage {
  private storage: Storage;

  constructor(persist: boolean = true) {
    // Tenta detectar onde o token está salvo
    const hasLocal = Object.keys(localStorage).some(k => k.startsWith('sb-'));
    const hasSession = Object.keys(sessionStorage).some(k => k.startsWith('sb-'));

    if (hasLocal) {
      this.storage = localStorage;
    } else if (hasSession) {
      this.storage = sessionStorage;
    } else {
      // Se não tiver em nenhum, usa a preferência (que por padrão é localStorage)
      this.storage = persist ? localStorage : sessionStorage;
    }
  }

  getItem(key: string): string | null {
    return this.storage.getItem(key);
  }

  setItem(key: string, value: string): void {
    this.storage.setItem(key, value);
  }

  removeItem(key: string): void {
    this.storage.removeItem(key);
  }

  setPersistence(persist: boolean) {
    // Se mudar a persistência, movemos os dados de um storage para o outro
    const oldStorage = this.storage;
    const newStorage = persist ? localStorage : sessionStorage;
    
    // Lista de chaves do Supabase para mover
    const keysToMove = [];
    for (let i = 0; i < oldStorage.length; i++) {
        const key = oldStorage.key(i);
        if (key && key.startsWith('sb-')) {
            keysToMove.push(key);
        }
    }

    keysToMove.forEach(key => {
        const value = oldStorage.getItem(key);
        if (value) {
            newStorage.setItem(key, value);
            oldStorage.removeItem(key);
        }
    });

    this.storage = newStorage;
  }
}

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;
  private customStorage: CustomStorage;

  constructor() {
    this.customStorage = new CustomStorage(true); // Default to localStorage

    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
        storage: this.customStorage,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        lock: (name, acquireTimeout, fn) => {
          return fn();
        },
      }
    });
  }

  public get supabaseClient(): SupabaseClient {
    return this.supabase;
  }

  public setPersistence(persist: boolean) {
    this.customStorage.setPersistence(persist);
  }

  async signIn(identifier: string, password: string) {
    const isEmail = identifier.includes('@');
    let email = identifier;

    if (!isEmail) {
      const { data, error } = await this.supabase
        .rpc('get_email_by_username', { username_input: identifier });
      
      if (error || !data) {
        return { data: { user: null, session: null }, error: error || new Error('Usuário não encontrado') };
      }
      email = data;
    }

    return this.supabase.auth.signInWithPassword({
      email,
      password
    });
  }

  async signUp(email: string, password: string, data: { name: string; username: string; }) {
    return this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: data.name,
          username: data.username,
          avatar_url: `https://ui-avatars.com/api/?name=${data.name}&background=random`
        }
      }
    });
  }
}
