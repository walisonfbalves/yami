import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../button/button.component';

export type DialogType = 'confirm' | 'alert' | 'danger';

@Component({
  selector: 'ui-dialog',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div *ngIf="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" (click)="onBackdropClick()"></div>

        <!-- Modal -->
        <div class="relative w-full max-w-sm bg-surface rounded-2xl shadow-2xl border border-surface-border overflow-hidden transform transition-all animate-scale-in flex flex-col">
            
            <!-- Icon/Header Area -->
            <div class="p-6 flex flex-col items-center text-center pb-2">
                <div [ngClass]="getIconColors()" class="w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <span class="material-symbols-outlined text-2xl">{{ getIconName() }}</span>
                </div>
                <h3 class="text-xl font-heading font-bold text-text-primary mb-2">{{ title }}</h3>
                <p class="text-text-secondary text-sm leading-relaxed">{{ message }}</p>
            </div>

            <!-- Actions -->
            <div class="p-6 pt-4 flex gap-3 justify-center">
                <ui-button 
                    *ngIf="type !== 'alert'"
                    variant="ghost" 
                    (click)="onCancel()">
                    {{ cancelText }}
                </ui-button>
                <ui-button 
                    [variant]="getConfirmButtonVariant()" 
                    (click)="onConfirm()">
                    {{ confirmText }}
                </ui-button>
            </div>
        </div>
    </div>
  `,
  styles: [`
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    .animate-scale-in { animation: scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1); }
  `]
})
export class DialogComponent {
  @Input() isOpen = false;
  @Input() title = '';
  @Input() message = '';
  @Input() type: DialogType = 'confirm';
  @Input() confirmText = 'Confirmar';
  @Input() cancelText = 'Cancelar';

  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }

  onCancel() {
    this.cancel.emit();
  }

  onBackdropClick() {
    if (this.type !== 'alert') {
        this.cancel.emit();
    }
  }

  getIconColors(): string {
    switch (this.type) {
        case 'danger': return 'bg-danger-bg text-danger';
        case 'alert': return 'bg-info-bg text-info';
        case 'confirm': default: return 'bg-primary-light text-primary';
    }
  }

  getIconName(): string {
    switch (this.type) {
        case 'danger': return 'warning'; // 'report_problem'
        case 'alert': return 'info';
        case 'confirm': default: return 'help';
    }
  }

  getConfirmButtonVariant(): any {
      switch (this.type) {
          case 'danger': return 'danger';
          case 'alert': return 'primary';
          case 'confirm': default: return 'primary';
      }
  }
}
