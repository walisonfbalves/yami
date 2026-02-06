import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'yami-badge',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span class="bg-primary/10 text-primary px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">
      <ng-content></ng-content>
    </span>
  `
})
export class BadgeComponent {}
