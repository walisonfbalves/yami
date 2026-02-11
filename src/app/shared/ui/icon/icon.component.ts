import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-icon',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span 
      class="material-symbols-outlined select-none" 
      [style.font-size]="size"
      [class]="color">
      {{ name }}
    </span>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IconComponent {
  @Input() name: string = '';
  @Input() size: string = '24px';
  @Input() color: string = '';
}
