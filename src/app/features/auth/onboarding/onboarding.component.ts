import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { StoreService } from '../../../core/services/store.service';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../shared/ui/toast/toast.service';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './onboarding.component.html',
})
export class OnboardingComponent {
  private fb = inject(FormBuilder);
  private storeService = inject(StoreService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private toast = inject(ToastService);

  storeForm: FormGroup;
  isLoading = false;

  constructor() {
    this.storeForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      slug: ['', [Validators.required, Validators.pattern(/^[a-z0-9-]+$/)]],
      phone: ['']
    });
  }

  // Gera slug automaticamente a partir do nome
  generateSlug() {
      const name = this.storeForm.get('name')?.value;
      if (name) {
          const slug = name
              .toLowerCase()
              .normalize('NFD') // Remove acentos
              .replace(/[\u0300-\u036f]/g, "")
              .replace(/[^a-z0-9]+/g, '-') // Substitui espaços e chars especiais por hífen
              .replace(/^-+|-+$/g, ''); // Remove hifens do começo/fim
          
          this.storeForm.patchValue({ slug });
      }
  }

  async onSubmit() {
    if (this.storeForm.invalid) return;

    this.isLoading = true;
    const { name, slug, phone } = this.storeForm.value;

    try {
      await this.storeService.createStore({ name, slug, phone });
      this.toast.show('Restaurante criado com sucesso!', 'success');
      
      // Força recarregamento ou navegação limpa para atualizar guards
      window.location.href = '/admin'; 
    } catch (error: any) {
      console.error(error);
      if (error.code === '23505') { // Erro de unicidade (slug duplicado)
          this.toast.show('Este link já está em uso. Tente outro.', 'error');
          this.storeForm.get('slug')?.setErrors({ unique: true });
      } else {
          this.toast.show('Erro ao criar restaurante. Tente novamente.', 'error');
      }
    } finally {
      this.isLoading = false;
    }
  }

  async logout() {
    await this.authService.signOut();
  }
}
