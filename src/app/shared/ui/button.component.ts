import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'yami-button',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button [class]="getClasses()">
      <ng-content></ng-content>
    </button>
  `
})
export class ButtonComponent {
  @Input() variant: 'primary' | 'outline' | 'ghost' = 'primary';
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  getClasses(): string {
    const base = 'inline-flex items-center justify-center rounded-lg font-heading font-medium transition-all active:scale-95';
    
    const variants = {
      primary: 'bg-primary text-primary-fg hover:bg-amber-400 shadow-lg shadow-amber-900/20',
      outline: 'border border-muted bg-transparent hover:bg-surface text-text-main',
      ghost: 'bg-transparent hover:bg-surface text-text-main' // Implicit ghost style, though not explicitly detained in prompt, adding logical default
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-base',
      lg: 'px-6 py-3 text-lg'
    };

    // Note: User prompt for outline was: "border border-muted bg-transparent hover:bg-surface text-text-main"
    // User prompt for primary was: "bg-primary text-primary-fg hover:bg-amber-400 shadow-lg shadow-amber-900/20"
    // User requested ghost variant input but didn't specify exact styles for it, so I'll use a minimal version of outline/transparent.

    return `${base} ${variants[this.variant] || variants.primary} ${sizes[this.size] || sizes.md}`;
  }
}
