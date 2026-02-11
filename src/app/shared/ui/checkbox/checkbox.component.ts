import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-checkbox',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex items-center">
        <label class="relative flex items-center p-2 rounded-full cursor-pointer hover:bg-gray-100 dark:hover:bg-white/5 transition-colors"
               [for]="id">
            <input type="checkbox"
                   class="peer relative appearance-none w-5 h-5 border border-stone-300 dark:border-stone-600 rounded-md bg-white dark:bg-stone-800 checked:bg-primary checked:border-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all cursor-pointer"
                   [id]="id"
                   [formControl]="control"/>
            <span class="absolute text-white transition-opacity opacity-0 pointer-events-none top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 peer-checked:opacity-100">
                <span class="material-symbols-outlined text-sm font-bold">check</span>
            </span>
        </label>
        <label [for]="id" class="ml-2 block text-sm text-stone-600 dark:text-stone-400 cursor-pointer select-none font-medium">
            <span *ngIf="label">{{ label }}</span>
            <ng-content></ng-content>
        </label>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CheckboxComponent {
  @Input() label: string = '';
  @Input() control: FormControl = new FormControl();
  @Input() id: string = `checkbox-${Math.random().toString(36).substr(2, 9)}`;
}
