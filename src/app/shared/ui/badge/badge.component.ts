import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span [class]="getClasses()">
      <span *ngIf="icon" class="material-symbols-outlined text-[14px] mr-1">{{ icon }}</span>
      <ng-content></ng-content>
      {{ label }}
    </span>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BadgeComponent {
  @Input() variant: 'neutral' | 'brand' | 'success' | 'warning' | 'danger' = 'neutral';
  @Input() label: string = '';
  @Input() icon: string = '';

  getClasses(): string {
      const base = 'inline-flex items-center px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider border select-none';
      
      const variants = {
          neutral: 'bg-stone-500/10 text-stone-400 border-stone-500/20',
          brand: 'bg-amber-500/10 text-amber-500 border-amber-500/20 shadow-[0_0_10px_-3px_rgba(245,158,11,0.3)]',
          success: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20 shadow-[0_0_10px_-3px_rgba(16,185,129,0.3)]',
          warning: 'bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_10px_-3px_rgba(249,115,22,0.3)]',
          danger: 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_10px_-3px_rgba(239,68,68,0.3)]'
      };

      return `${base} ${variants[this.variant]}`;
  }
}
