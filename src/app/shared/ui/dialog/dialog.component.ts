import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center animate-fade-in">

        <!-- Card -->
        <div class="bg-surface border border-surface-border rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-scale-up">

            <!-- Icon + Content -->
            <div class="flex gap-4 items-start">
                <div [ngClass]="iconClasses" class="w-12 h-12 rounded-full flex items-center justify-center shrink-0">
                    <span class="material-symbols-outlined text-2xl">{{ iconName }}</span>
                </div>
                <div class="flex-1 min-w-0">
                    <h3 class="text-xl font-bold text-text-primary">{{ title }}</h3>
                    <p class="text-sm text-text-secondary mt-2">{{ message }}</p>
                </div>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 mt-6">
                <ui-button variant="ghost" (click)="onCancel()">
                    {{ cancelText }}
                </ui-button>
                <ui-button [variant]="variant" (click)="onConfirm()">
                    {{ confirmText }}
                </ui-button>
            </div>
        </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-scale-up { animation: scaleUp 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class DialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() variant: 'danger' | 'primary' = 'primary';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  get iconClasses(): string {
    return this.variant === 'danger'
      ? 'bg-danger-bg text-danger-text'
      : 'bg-primary-light text-primary';
  }

  get iconName(): string {
    return this.variant === 'danger' ? 'warning' : 'info';
  }

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }
}
