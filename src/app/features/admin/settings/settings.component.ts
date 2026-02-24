import { Component, ChangeDetectionStrategy, ChangeDetectorRef, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { TextareaComponent } from '../../../shared/ui/textarea/textarea.component';
import { SwitchComponent } from '../../../shared/ui/switch/switch.component';

import { StoreProfileService } from '../../../core/services/store-profile.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

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
  showToast = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    public storeService: StoreProfileService,
    private cdr: ChangeDetectorRef
  ) {
    this.settingsForm = this.fb.group({
      // Store Identity
      name: ['', Validators.required],
      slug: ['', Validators.required],
      description: [''],
      logo_url: [''],
      cover_url: [''],
      
      // Operation
      is_open: [false],
      prep_time: ['', Validators.required],
      
      // Finance & Delivery
      delivery_fee: [0, Validators.required],
      min_order_value: [0, Validators.required],
      pix_key: ['']
    });

    // Load initial data
    // Load initial data
    // Effect or manual subscription to signal
    effect(() => {
      const store = this.storeService.currentStore();
      if (store) {
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
        this.showToast = true;
        setTimeout(() => {
            this.showToast = false;
            this.cdr.markForCheck();
        }, 3000);
      } catch (error) {
        console.error('Error updating settings:', error);
        // Handle error (show toast?)
      } finally {
        this.isLoading = false;
        this.cdr.markForCheck();
      }
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
      this.getControl('logo_url').setValue(publicUrl);
      this.getControl('logo_url').markAsDirty();
      
      this.showToastMessage('Logo atualizada com sucesso!');
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
      this.getControl('cover_url').setValue(publicUrl);
      this.getControl('cover_url').markAsDirty();

      this.showToastMessage('Capa atualizada com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload da capa:', error);
      this.showToastMessage('Erro ao fazer upload da capa.', true);
    } finally {
      this.isLoadingCover = false;
      this.cdr.markForCheck();
    }
  }

  showToastMessage(message: string, isError = false) {
    // Reuse existing toast logic or create a better one. 
    // For now, simpler adjustment to existing showToast
    this.showToast = true;
    this.cdr.markForCheck();

    // Ideally we bind the message to the template. 
    // Since template has hardcoded message, we might want to update it to be dynamic, 
    // but for now let's just trigger the success state.
    // If error, we might want to log it or show a different toast.
    if (isError) {
        alert(message); // Fallback for error
        this.showToast = false;
        this.cdr.markForCheck();
    } else {
        setTimeout(() => {
            this.showToast = false;
            this.cdr.markForCheck();
        }, 3000);
    }
  }
}
