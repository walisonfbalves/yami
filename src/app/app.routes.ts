import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'auth/login', // Default redirect for now to show off new screens
    pathMatch: 'full',
  },
  {
    path: 'auth/login',
    loadComponent: () =>
      import('./features/auth/login/login.component').then((m) => m.LoginComponent),
  },
  {
    path: 'auth/register', // Placeholder for now or maps to login with query param
    redirectTo: 'auth/login'
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        },
        {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
        }
    ]
  },
  // Fallback
  {
      path: '**',
      redirectTo: 'auth/login'
  }
];
