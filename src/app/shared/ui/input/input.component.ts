import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full">
        <label *ngIf="label" class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            {{ label }}
        </label>
        
        <div class="relative flex items-center bg-background-dark border border-white/10 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden group">
            
            <!-- Prefix -->
            <div *ngIf="prefix" class="bg-white/5 px-3 uppercase text-gray-500 font-bold border-r border-white/10 text-sm h-full flex items-center">
                {{ prefix }}
            </div>
            
            <!-- Icon Left -->
             <div *ngIf="icon" class="pl-3 text-gray-500 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-xl">{{ icon }}</span>
            </div>

            <input
                [type]="currentType"
                [formControl]="control"
                [placeholder]="placeholder"
                class="w-full bg-transparent border-none outline-none text-white px-3 py-3 placeholder-gray-600 font-medium"
            />

            <!-- Icon Right / Action -->
            <button *ngIf="type === 'password' || iconRight" 
                    type="button"
                    (click)="handleRightIconClick()"
                    [class.cursor-pointer]="type === 'password' || iconRightClick.observed"
                    [class.pointer-events-none]="type !== 'password' && !iconRightClick.observed"
                    class="pr-3 text-gray-500 hover:text-white transition-colors flex items-center outline-none">
                <span class="material-symbols-outlined text-xl">
                    {{ type === 'password' ? (visible ? 'visibility_off' : 'visibility') : iconRight }}
                </span>
            </button>

            <!-- Suffix -->
            <div *ngIf="suffix" class="bg-white/5 px-3 py-3 text-gray-500 font-bold border-l border-white/10 text-sm">
                {{ suffix }}
            </div>
        </div>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent {
  @Input() label: string = '';
  @Input() control: FormControl = new FormControl();
  @Input() type: 'text' | 'number' | 'email' | 'password' = 'text';
  @Input() placeholder: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() icon: string = ''; // Left icon
  @Input() iconRight: string = ''; // Right icon (custom)
  
  @Output() iconRightClick = new EventEmitter<void>();

  visible = false;

  get currentType(): string {
    if (this.type === 'password') {
      return this.visible ? 'text' : 'password';
    }
    return this.type;
  }

  handleRightIconClick() {
    if (this.type === 'password') {
      this.visible = !this.visible;
    } else {
      this.iconRightClick.emit();
    }
  }
}
