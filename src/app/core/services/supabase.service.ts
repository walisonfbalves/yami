import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey, {
      auth: {
        persistSession: true,
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
