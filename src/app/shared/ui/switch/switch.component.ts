import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-switch',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex items-center justify-between p-4 bg-background-dark border border-white/10 rounded-xl">
        <div>
            <h3 class="text-sm font-bold text-white">{{ label }}</h3>
            <p *ngIf="description" class="text-xs text-gray-500">{{ description }}</p>
        </div>
        
        <label class="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" [formControl]="control" class="sr-only peer">
            <div class="w-11 h-6 bg-stone-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50  rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
        </label>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SwitchComponent {
  @Input() label: string = '';
  @Input() description: string = '';
  @Input() control: FormControl = new FormControl();
}
