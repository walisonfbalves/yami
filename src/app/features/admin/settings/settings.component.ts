import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CardComponent } from '../../../shared/ui/card/card.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { TextareaComponent } from '../../../shared/ui/textarea/textarea.component';
import { SwitchComponent } from '../../../shared/ui/switch/switch.component';

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
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent {
  settingsForm: FormGroup;
  showToast = false;

  constructor(private fb: FormBuilder) {
    this.settingsForm = this.fb.group({
      // Store Identity
      storeName: ['Yami Backend', Validators.required],
      storeSlug: ['yami-backend', Validators.required],
      storeBio: ['O melhor burger da cidade entregue na sua casa!'],
      
      // Operation
      isOpen: [true],
      prepTime: ['40-50', Validators.required],
      
      // Finance & Delivery
      deliveryFee: [5.00, Validators.required],
      minOrder: [20.00, Validators.required],
      pixKey: ['00.000.000/0001-00']
    });
  }

  onSubmit() {
    if (this.settingsForm.valid) {
      console.log('Settings Saved:', this.settingsForm.value);
      this.showToast = true;
      setTimeout(() => this.showToast = false, 3000);
    }
  }

  // Helper for toggle class
  get isOpen() { return this.settingsForm.get('isOpen')?.value; }

  getControl(name: string): FormControl {
    return this.settingsForm.get(name) as FormControl;
  }
}
