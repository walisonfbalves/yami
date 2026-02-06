import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'yami-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-surface border border-muted rounded-xl p-4 shadow-sm">
      <ng-content></ng-content>
    </div>
  `
})
export class CardComponent {}
