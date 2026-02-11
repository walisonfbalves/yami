import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface DialogConfig {
  title: string;
  message: string;
  variant?: 'danger' | 'primary';
  confirmText?: string;
  cancelText?: string;
}

interface DialogState extends DialogConfig {
  isOpen: boolean;
  resolve?: (value: boolean) => void;
}

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  private state = new BehaviorSubject<DialogState>({
    isOpen: false,
    title: '',
    message: ''
  });

  state$ = this.state.asObservable();

  confirm(config: DialogConfig): Promise<boolean> {
    return new Promise<boolean>((resolve) => {
      this.state.next({
        ...config,
        isOpen: true,
        resolve
      });
    });
  }

  alert(title: string, message: string): Promise<boolean> {
    return this.confirm({
      title,
      message,
      variant: 'primary',
      confirmText: 'OK',
      cancelText: 'Cancelar'
    });
  }

  onConfirm() {
    const currentState = this.state.value;
    if (currentState.resolve) {
      currentState.resolve(true);
    }
    this.close();
  }

  onCancel() {
    const currentState = this.state.value;
    if (currentState.resolve) {
      currentState.resolve(false);
    }
    this.close();
  }

  private close() {
    this.state.next({
      ...this.state.value,
      isOpen: false,
      resolve: undefined
    });
  }
}
