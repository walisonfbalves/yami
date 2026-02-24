import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-textarea',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full">
        <label *ngIf="label" class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            {{ label }}
        </label>
        
        <div class="relative bg-background-dark border border-white/10 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden group">
            <textarea
                [rows]="rows"
                [maxLength]="maxLength"
                [formControl]="control"
                [placeholder]="placeholder"
                class="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white px-3 py-3 placeholder-gray-600 font-medium resize-none"
            ></textarea>
        </div>
        
        <div class="flex justify-end mt-1">
            <span class="text-xs text-gray-500 font-medium" *ngIf="maxLength">
                {{ control.value?.length || 0 }} / {{ maxLength }}
            </span>
        </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextareaComponent {
  @Input() label: string = '';
  @Input() control: FormControl = new FormControl();
  @Input() placeholder: string = '';
  @Input() rows: number = 3;
  @Input() maxLength: number | null = null;
}
