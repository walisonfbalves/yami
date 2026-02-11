import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../../environments/environment';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { CheckboxComponent } from '../../../shared/ui/checkbox/checkbox.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule, 
    RouterModule,
    InputComponent,
    CheckboxComponent,
    ButtonComponent
  ],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginForm: FormGroup;
  registerForm: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  activeTab: 'login' | 'register' = 'login';
  private supabase: SupabaseClient;

  constructor(
    private fb: FormBuilder, 
    private router: Router,
    private toast: ToastService
  ) {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);

    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });

    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(6)]],
      login: ['', [Validators.required, Validators.minLength(3), Validators.pattern('^[a-z0-9-]+$')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', [Validators.required]],
      terms: [false, [Validators.requiredTrue]]
    }, { validators: this.passwordMatchValidator });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  toggleTab(tab: 'login' | 'register'): void {
    this.activeTab = tab;
  }

  passwordMatchValidator(form: FormGroup) {
    const password = form.get('password');
    const confirmPassword = form.get('confirmPassword');

    if (!password || !confirmPassword) {
      return null;
    }

    if (password.value !== confirmPassword.value) {
      confirmPassword.setErrors({ passwordMismatch: true });
    } else {
      if (confirmPassword.errors) {
          const { passwordMismatch, ...otherErrors } = confirmPassword.errors;
          confirmPassword.setErrors(Object.keys(otherErrors).length ? otherErrors : null);
      }
    }
    return null;
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      
    } catch (error: any) {
      this.toast.show('Erro ao conectar com Google: ' + error.message, 'error');
    }
  }

  onSubmit(): void {
    if (this.activeTab === 'login') {
      if (this.loginForm.valid) {
        // Here we should also implement Supabase Email Login later, but keeping mock for now as requested only Google Auth today.
        this.toast.show('Login realizado com sucesso!', 'success');
        localStorage.setItem('yami_token', 'mock_token_' + Date.now());
        setTimeout(() => this.router.navigate(['/admin']), 800);
      } else {
          this.loginForm.markAllAsTouched();
          this.toast.show('Por favor, preencha todos os campos.', 'error');
      }
    } else {
      if (this.registerForm.valid) {
        console.log('Dados de Cadastro:', this.registerForm.value);
        this.toast.show('Conta criada com sucesso! Faça login.', 'success');
        this.toggleTab('login');
        this.registerForm.reset();
      } else {
        this.registerForm.markAllAsTouched();
        this.toast.show('Corrija os erros do formulário.', 'error');
      }
    }
  }
}
