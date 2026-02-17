import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { InputComponent } from '../../../shared/ui/input/input.component';
import { ButtonComponent } from '../../../shared/ui/button/button.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TenantService, TenantConfig } from '../../../core/services/tenant.service';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-layout.component.html',
})
export class AdminLayoutComponent {


  private tenantService = inject(TenantService);
  private authService = inject(AuthService);
  private router = inject(Router);
  
  tenant$ = this.tenantService.tenant$;
  availableTenants = this.tenantService.availableTenants;

  switchTenant(slug: string) {
    this.tenantService.setTenant(slug);
  }

  async logout() {
    await this.authService.signOut();
    this.router.navigate(['/auth/login']);
  }
}
