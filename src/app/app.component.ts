import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { ToastComponent } from './shared/ui/toast/toast.component';
import { DialogComponent } from './shared/ui/dialog/dialog.component';
import { DialogService } from './shared/ui/dialog/dialog.service';

import { SupabaseService } from './core/services/supabase.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, DialogComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'yami';
  dialogService = inject(DialogService);
  supabaseService = inject(SupabaseService);
  dialogState$ = this.dialogService.state$;

  constructor() {
    console.log('Supabase Status:', this.supabaseService.supabaseClient ? 'Inicializado' : 'Erro');
  }
}
