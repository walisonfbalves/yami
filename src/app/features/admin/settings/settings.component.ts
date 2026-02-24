import { Component, ChangeDetectionStrategy, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule } from '@angular/forms';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { TextareaComponent } from '../../../shared/ui/textarea/textarea.component';
import { SwitchComponent } from '../../../shared/ui/switch/switch.component';

import { StoreProfileService } from '../../../core/services/store-profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { pixKeyValidator } from '../../../shared/utils/pix.validator';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule, 
    ReactiveFormsModule,
    CardComponent,
    ButtonComponent,
    InputComponent,
    TextareaComponent,
    SwitchComponent
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent {
  settingsForm: FormGroup;
  toast = { show: false, message: '', type: 'success' as 'success' | 'error' };
  isLoading = false;

  logoPreview: string | null = null;
  coverPreview: string | null = null;

  constructor(
    private fb: FormBuilder,
    public storeService: StoreProfileService,
    private cdr: ChangeDetectorRef
  ) {
    this.settingsForm = this.fb.group({
      // Store Identity
      name: [''],
      slug: [''],
      description: [''],
      logo_url: [''],
      cover_url: [''],
      
      // Operation
      is_open: [false],
      prep_time: [''],
      
      // Finance & Delivery
      delivery_fee: [0],
      min_order_value: [0],
      pix_key: ['', [pixKeyValidator()]]
    });

    // Load initial data
    // Load initial data
    // Effect or manual subscription to signal
    effect(() => {
      const store = this.storeService.currentStore();
      if (store) {
        this.logoPreview = store.logo_url || null;
        this.coverPreview = store.cover_url || null;
        
        this.settingsForm.patchValue({
          name: store.name,
          slug: store.slug,
          description: store.description,
          logo_url: store.logo_url,
          cover_url: store.cover_url,
          is_open: store.is_open,
          prep_time: store.prep_time,
          delivery_fee: store.delivery_fee,
          min_order_value: store.min_order_value,
          pix_key: store.pix_key
        }, { emitEvent: false });
        this.cdr.markForCheck();
      }
    });
  }

  async onSubmit() {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      try {
        await this.storeService.updateStoreProfile(this.settingsForm.value);
        this.showToastMessage('Alterações salvas com sucesso!');
      } catch (error) {
        console.error('Error updating settings:', error);
        // Handle error (show toast?)
      } finally {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    } else {
      console.error('Formulário inválido', this.settingsForm.value, this.settingsForm.errors);
      this.showToastMessage('Preencha todos os campos obrigatórios.', true);
    }
  }

  // Helper for toggle class
  get isOpen() { return this.settingsForm.get('is_open')?.value; }

  getControl(name: string): FormControl {
    return this.settingsForm.get(name) as FormControl;
  }

  // Image Upload Handlers
  isLoadingLogo = false;
  isLoadingCover = false;

  async onLogoSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isLoadingLogo = true;
    this.cdr.markForCheck(); // Ensure spinner shows
    try {
      // 1. Compress (Logo: 300x300 is enough)
      const compressedBlob = await import('../../../shared/utils/image-compressor').then(m => m.compressImage(file, 300, 300));
      
      // 2. Upload
      const publicUrl = await this.storeService.uploadStoreImage(compressedBlob, 'logo');

      // 3. Update Form & Preview
      this.logoPreview = publicUrl;
      this.getControl('logo_url').setValue(publicUrl);
      this.getControl('logo_url').markAsDirty();
      
      this.showToastMessage('Logo enviada, salve para aplicar!');
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
      this.showToastMessage('Erro ao fazer upload do logo.', true);
    } finally {
      this.isLoadingLogo = false;
      this.cdr.markForCheck();
    }
  }

  async onCoverSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    this.isLoadingCover = true;
    this.cdr.markForCheck(); // Ensure spinner shows
    try {
      // 1. Compress (Cover: 1280x720 is good balance)
      const compressedBlob = await import('../../../shared/utils/image-compressor').then(m => m.compressImage(file, 1280, 720));
      
      // 2. Upload
      const publicUrl = await this.storeService.uploadStoreImage(compressedBlob, 'cover');

      // 3. Update Form & Preview
      this.coverPreview = publicUrl;
      this.getControl('cover_url').setValue(publicUrl);
      this.getControl('cover_url').markAsDirty();

      this.showToastMessage('Capa enviada, salve para aplicar!');
    } catch (error) {
      console.error('Erro ao fazer upload da capa:', error);
      this.showToastMessage('Erro ao fazer upload da capa.', true);
    } finally {
      this.isLoadingCover = false;
      this.cdr.markForCheck();
    }
  }

  removeLogo(event: Event) {
    event.stopPropagation();
    this.logoPreview = null;
    this.getControl('logo_url').setValue(null);
    this.getControl('logo_url').markAsDirty();
    this.showToastMessage('Logo removido. Salve as alterações.');
  }

  removeCover(event: Event) {
    event.stopPropagation();
    this.coverPreview = null;
    this.getControl('cover_url').setValue(null);
    this.getControl('cover_url').markAsDirty();
    this.showToastMessage('Capa removida. Salve as alterações.');
  }
  showToastMessage(message: string, isError = false) {
    this.toast = {
      show: true,
      message,
      type: isError ? 'error' : 'success'
    };
    this.cdr.markForCheck();

    setTimeout(() => {
      this.toast.show = false;
      this.cdr.markForCheck();
    }, 3000);
  }
}
