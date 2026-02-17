import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { TextareaComponent } from '../../../shared/ui/textarea/textarea.component';
import { SwitchComponent } from '../../../shared/ui/switch/switch.component';

import { StoreService } from '../../../core/services/store.service';
import { Router } from '@angular/router'; // Keeping Router just in case, but unused based on changes
import { AuthService } from '../../../core/services/auth.service'; // Keeping for now or removing if unused

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
    private storeService: StoreService
  ) {
    this.settingsForm = this.fb.group({
      // Store Identity
      name: ['', Validators.required],
      slug: ['', Validators.required],
      bio: [''],
      logo_url: [''],
      banner_url: [''],
      
      // Operation
      is_open: [false],
      prep_time: ['', Validators.required],
      
      // Finance & Delivery
      delivery_fee: [0, Validators.required],
      min_order: [0, Validators.required],
      pix_key: ['']
    });

    // Load initial data
    this.storeService.currentStore$.subscribe(store => {
      if (store) {
        this.settingsForm.patchValue({
          name: store.name,
          slug: store.slug,
          bio: store.bio,
          logo_url: store.logo_url,
          banner_url: store.banner_url,
          is_open: store.is_open,
          prep_time: store.prep_time,
          delivery_fee: store.delivery_fee,
          min_order: store.min_order,
          pix_key: store.pix_key
        }, { emitEvent: false }); // Avoid triggering valueChanges if any
      }
    });
  }

  async onSubmit() {
    if (this.settingsForm.valid) {
      this.isLoading = true;
      try {
        await this.storeService.updateStore(this.settingsForm.value);
        this.showToast = true;
        setTimeout(() => this.showToast = false, 3000);
      } catch (error) {
        console.error('Error updating settings:', error);
        // Handle error (show toast?)
      } finally {
        this.isLoading = false;
      }
    }
  }

  // Helper for toggle class
  get isOpen() { return this.settingsForm.get('is_open')?.value; }

  getControl(name: string): FormControl {
    return this.settingsForm.get(name) as FormControl;
  }
}
