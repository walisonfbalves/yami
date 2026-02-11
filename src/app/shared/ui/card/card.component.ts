import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ui-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="getClasses()">
      <ng-content></ng-content>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CardComponent {
    @Input() noPadding: boolean = false;
    @Input() className: string = '';

    getClasses(): string {
        const base = 'bg-stone-900 border border-stone-800 rounded-xl shadow-sm overflow-hidden flex flex-col';
        const padding = this.noPadding ? '' : 'p-6';
        
        return `${base} ${padding} ${this.className}`;
    }
}
