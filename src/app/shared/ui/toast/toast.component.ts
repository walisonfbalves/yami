import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast } from './toast.service';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'ui-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed bottom-8 right-8 z-50 flex flex-col gap-3 pointer-events-none">
      <div *ngFor="let toast of toastService.toasts$ | async" 
           [@slideInOut]
           class="pointer-events-auto flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl min-w-[300px] border border-white/10 backdrop-blur-md"
           [ngClass]="getClasses(toast.type)">
        
        <span class="material-symbols-outlined">{{ getIcon(toast.type) }}</span>
        <span class="font-bold text-sm">{{ toast.message }}</span>
        
        <button (click)="toastService.remove(toast.id)" class="ml-auto opacity-70 hover:opacity-100 transition-opacity">
            <span class="material-symbols-outlined text-sm">close</span>
        </button>
      </div>
    </div>
  `,
  styles: [],
  animations: [
    trigger('slideInOut', [
      transition(':enter', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('300ms cubic-bezier(0.16, 1, 0.3, 1)', style({ transform: 'translateX(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('200ms ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}

  getClasses(type: string): string {
    switch (type) {
      case 'success': return 'bg-emerald-500/90 text-white';
      case 'error': return 'bg-red-500/90 text-white';
      case 'warning': return 'bg-amber-500/90 text-white';
      case 'info': return 'bg-blue-500/90 text-white';
      default: return 'bg-stone-800 text-white';
    }
  }

  getIcon(type: string): string {
    switch (type) {
      case 'success': return 'check_circle';
      case 'error': return 'error';
      case 'warning': return 'warning';
      case 'info': return 'info';
      default: return 'notifications';
    }
  }
}
