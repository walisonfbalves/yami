import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-metric-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-stone-900 border border-stone-800 p-6 rounded-xl relative overflow-hidden group transition-all hover:border-[color] h-full flex flex-col justify-between">
      <!-- Hover Effect Bar -->
      <div 
        class="absolute top-0 left-0 w-1 h-full opacity-100 transition-opacity"
        [ngClass]="getAccentColor('bg')">
      </div>

      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div class="p-2 rounded-lg" [ngClass]="getIconStyles()">
          <span class="material-symbols-outlined">{{ icon }}</span>
        </div>
        
        <span *ngIf="trend" 
          class="flex items-center gap-1 text-sm font-bold px-2 py-0.5 rounded"
          [ngClass]="getTrendStyles()">
          <span class="material-symbols-outlined text-[16px]">trending_up</span>
          {{ trend }}
        </span>
      </div>

      <!-- Content -->
      <div>
        <p class="text-gray-400 text-sm font-medium">{{ title }}</p>
        <h3 class="text-3xl font-heading font-bold mt-1 text-white truncate" [title]="value">{{ value }}</h3>
      </div>

      <!-- Footer/Slot -->
      <div class="mt-4 flex items-center gap-2 text-xs text-gray-500">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MetricCardComponent {
  @Input() title: string = '';
  @Input() value: string | null = '';
  @Input() icon: string = '';
  @Input() trend: string = '';
  @Input() variant: 'finance' | 'orders' | 'people' | 'performance' = 'finance';

  getAccentColor(type: 'bg' | 'text' | 'border'): string {
    const map = {
      finance: { bg: 'bg-amber-500', text: 'text-amber-500', border: 'border-amber-500' },
      orders: { bg: 'bg-blue-500', text: 'text-blue-500', border: 'border-blue-500' },
      people: { bg: 'bg-violet-500', text: 'text-violet-500', border: 'border-violet-500' },
      performance: { bg: 'bg-emerald-500', text: 'text-emerald-500', border: 'border-emerald-500' }
    };
    return map[this.variant][type];
  }

  getIconStyles(): string {
     const styles = {
      finance: 'bg-amber-500/10 text-amber-500 shadow-lg shadow-amber-500/10',
      orders: 'bg-blue-500/10 text-blue-500',
      people: 'bg-violet-500/10 text-violet-500',
      performance: 'bg-emerald-500/10 text-emerald-500'
     };
     return styles[this.variant];
  }

  getTrendStyles(): string {
      // Assuming positive trend is always emerald for now, or we could add an input for trend direction
      // For design simplicity adhering to 'Neon Glass'
      return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20';
  }
}
