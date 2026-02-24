import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy, forwardRef, OnInit, OnDestroy, ChangeDetectorRef, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { debounceTime, tap, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'ui-input',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="w-full">
        <label *ngIf="label" class="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block">
            {{ label }}
        </label>
        
        <div class="relative flex items-stretch bg-background-dark border border-white/10 rounded-xl focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all overflow-hidden group"
             [class.!border-red-500]="isErrorVisible()"
             [class.focus-within:!border-red-500]="isErrorVisible()"
             [class.focus-within:!ring-red-500]="isErrorVisible()">
            
            <!-- Prefix -->
            <div *ngIf="prefix" class="bg-white/5 px-3 py-3 uppercase text-gray-500 font-bold border-r border-white/10 text-sm flex items-center justify-center">
                {{ prefix }}
            </div>
            
            <!-- Icon Left -->
             <div *ngIf="icon" class="pl-3 text-gray-500 flex items-center pointer-events-none">
                <span class="material-symbols-outlined text-xl">{{ icon }}</span>
            </div>

            <!-- Regular Input -->
            <input *ngIf="prefix !== 'R$'"
                [type]="currentType"
                [formControl]="control"
                [placeholder]="placeholder"
                [attr.min]="type === 'number' ? '0' : null"
                (keydown)="onKeydown($event)"
                (input)="hideErrorSignal()"
                class="flex-1 w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white px-3 py-3 placeholder-gray-600 font-medium"
            />

            <!-- Currency Input (Left-to-Right Free Style) -->
            <input *ngIf="prefix === 'R$'"
                type="text"
                [value]="currencyDisplayValue"
                (input)="onCurrencyInput($event); hideErrorSignal()"
                (focus)="onCurrencyFocus()"
                (blur)="onCurrencyBlur()"
                [placeholder]="placeholder"
                class="flex-1 w-full h-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-white px-3 py-3 placeholder-gray-600 font-medium"
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
            <div *ngIf="suffix" class="bg-white/5 px-3 py-3 text-gray-500 font-bold border-l border-white/10 text-sm flex items-center justify-center">
                {{ suffix }}
            </div>
        </div>
        <p *ngIf="isErrorVisible() && errorMessage" class="text-red-500 text-xs mt-1 font-bold">{{ errorMessage }}</p>
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class InputComponent implements OnInit, OnDestroy {
  @Input() label: string = '';
  @Input() control: FormControl = new FormControl();
  @Input() type: 'text' | 'number' | 'email' | 'password' = 'text';
  @Input() placeholder: string = '';
  @Input() prefix: string = '';
  @Input() suffix: string = '';
  @Input() icon: string = ''; // Left icon
  @Input() iconRight: string = ''; // Right icon (custom)
  @Input() errorMessage: string = '';
  
  @Output() iconRightClick = new EventEmitter<void>();

  // A abordagem reativa pura com Signals
  isErrorVisible = signal(false);
  sub?: Subscription;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    if (this.control) {
      this.sub = this.control.valueChanges.pipe(
        // Sempre que digitar, desliga a mensagem instantaneamente
        tap(() => this.isErrorVisible.set(false)),
        // Exige 1.5s de silêncio
        debounceTime(1500),
        distinctUntilChanged()
      ).subscribe(() => {
        // Valida DEPOIS do silêncio
        const shouldShow = this.control.invalid && this.control.dirty;
        this.isErrorVisible.set(shouldShow);
      });
    }
  }

  // Backup em caso do (input) natural da tag HTML for mais rápido que o event loop do FormContorl
  hideErrorSignal() {
    if (this.isErrorVisible()) {
      this.isErrorVisible.set(false);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  visible = false;
  isCurrencyFocused = false;
  currentCurrencyStr = '';

  get currentType(): string {
    if (this.type === 'password') {
      return this.visible ? 'text' : 'password';
    }
    // Se for moeda, transformar em text para a máscara atuar formatando com vírgula livremente.
    if (this.prefix === 'R$') {
      return 'text';
    }
    return this.type;
  }

  onKeydown(event: KeyboardEvent) {
    if (this.type === 'number') {
      const invalidChars = ['-', '+', 'e', 'E'];
      if (invalidChars.includes(event.key)) {
        event.preventDefault();
      }
    }
  }

  handleRightIconClick() {
    if (this.type === 'password') {
      this.visible = !this.visible;
    } else {
      this.iconRightClick.emit();
    }
  }

  get currencyDisplayValue(): string {
    const value = this.control.value;
    if (value === null || value === undefined || value === '') return '';
    
    // Se está sendo editado ativamente, mostra a string crua suja exatamente como o user digitou
    if (this.isCurrencyFocused) {
      return this.currentCurrencyStr;
    }

    // Se saiu do foco, renderiza formatação bonita 1.000,00
    const num = parseFloat(value);
    if (isNaN(num)) return '';
    return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  onCurrencyInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    let value = inputElement.value;

    // Lógica Left-To-Right 
    // Remove tudo que não for dígito e vírgula
    value = value.replace(/[^0-9,]/g, '');
    
    const parts = value.split(',');
    // Previne mais de uma virgula
    if (parts.length > 2) {
      value = parts[0] + ',' + parts.slice(1).join('');
    }
    // Previne mais de duas casas decimais após a virgula
    if (parts.length === 2 && parts[1].length > 2) {
      value = parts[0] + ',' + parts[1].substring(0, 2);
    }

    this.currentCurrencyStr = value;
    inputElement.value = value;
    
    // Converte virgula p/ dot pro mundo float da Controller
    const floatValue = parseFloat(value.replace(',', '.'));
    this.control.setValue(isNaN(floatValue) ? null : floatValue, { emitEvent: false });
  }

  onCurrencyFocus() {
    this.isCurrencyFocused = true;
    const value = this.control.value;
    if (value !== null && value !== undefined && value !== '') {
      // Fornece a representação crua p/ edição (Ex: 12.30 vira '12,3') sem zeros desnecessários p/ não atrapalhar
      this.currentCurrencyStr = value.toString().replace('.', ',');
    } else {
      this.currentCurrencyStr = '';
    }
  }

  onCurrencyBlur() {
    this.isCurrencyFocused = false;
    this.control.markAsTouched();
    
    // Limpar state sujo
    if (this.control.value === null || this.control.value === undefined) {
      this.currentCurrencyStr = '';
    }
  }
}

