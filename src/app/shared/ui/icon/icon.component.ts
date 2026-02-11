import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="material-symbols-outlined select-none" 
      [style.font-size]="sizePx"
      [class]="color">
      {{ name }}
    </span>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() color: string = '';

  get sizePx(): string {
    const map = { sm: '16px', md: '24px', lg: '32px', xl: '48px' };
    return map[this.size];
  }
}
