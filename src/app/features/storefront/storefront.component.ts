import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-storefront',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-stone-50 flex flex-col items-center pt-20">
      <h1 class="text-4xl font-bold text-stone-900 mb-4">Cardápio Digital</h1>
      <p class="text-stone-500">A vitrine pública da loja aparecerá aqui.</p>
    </div>
  `,
  styles: []
})
export class StorefrontComponent {

}
