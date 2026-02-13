import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ButtonComponent } from '../../shared/ui/button/button.component';

@Component({
  selector: 'app-landing',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ButtonComponent],
  templateUrl: './landing.component.html'
})
export class LandingComponent {
  revenue = 2000;

  get planName(): string {
    if (this.revenue <= 1000) return 'Start';
    if (this.revenue <= 5000) return 'Crescimento';
    if (this.revenue <= 15000) return 'Pro';
    return 'Master';
  }

  get planPrice(): number {
    if (this.revenue <= 1000) return 0;
    if (this.revenue <= 5000) return 49.90;
    if (this.revenue <= 15000) return 99.90;
    return 189.90;
  }

  get formattedRevenue(): string {
    return this.revenue.toLocaleString('pt-BR');
  }

  get formattedPrice(): string {
    if (this.planPrice === 0) return 'Grátis';
    return this.planPrice.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  get isFree(): boolean {
    return this.planPrice === 0;
  }
}
