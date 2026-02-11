import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TenantService, TenantConfig } from '../../../core/services/tenant.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, InputComponent, ButtonComponent],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {
  searchControl = new FormControl('');

  private tenantService = inject(TenantService);
  tenant$ = this.tenantService.tenant$;
  availableTenants = this.tenantService.availableTenants;

  switchTenant(slug: string) {
    this.tenantService.setTenant(slug);
  }
}
