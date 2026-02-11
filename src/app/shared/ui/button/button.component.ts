import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button 
      [class]="getClasses()" 
      [disabled]="disabled || loading"
      (click)="onClick($event)">
      
      <span *ngIf="loading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-current">
        <svg class="opacity-75" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      </span>
      
      <span *ngIf="icon && !loading" class="material-symbols-outlined text-[20px]" [class.mr-2]="!iconOnly">{{ icon }}</span>
      
      <ng-content></ng-content>
    </button>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'outline' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';
  @Input() icon: string = '';
  @Input() iconOnly: boolean = false;
  @Input() loading: boolean = false;
  @Input() disabled: boolean = false;
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  onClick(event: MouseEvent) {
      if (this.disabled || this.loading) {
          event.stopPropagation();
      }
  }

  getClasses(): string {
    const base = 'inline-flex items-center justify-center rounded-lg font-heading font-medium transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-primary text-primary-content hover:bg-primary-hover shadow-lg shadow-primary/20',
      secondary: 'bg-transparent border border-stone-800 text-stone-300 hover:bg-stone-800 hover:text-white',
      ghost: 'bg-transparent text-stone-400 hover:text-white hover:bg-white/5',
      danger: 'bg-red-500/10 text-red-500 border border-red-500/20 hover:bg-red-500/20',
      outline: 'bg-transparent border border-primary text-primary hover:bg-primary-light'
    };

    const sizes = this.iconOnly ? {
      sm: 'w-7 h-7',
      md: 'w-9 h-9',
      lg: 'w-11 h-11'
    } : {
      sm: 'px-3 py-1.5 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base'
    };

    return `${base} ${variants[this.variant]} ${sizes[this.size]}`;
  }
}

