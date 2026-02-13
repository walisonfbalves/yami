import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/landing/landing.component').then(m => m.LandingComponent),
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
    path: 'legal/terms',
    loadComponent: () => import('./features/legal/legal.component').then(m => m.LegalComponent),
    data: { type: 'terms' }
  },
  {
    path: 'legal/privacy',
    loadComponent: () => import('./features/legal/legal.component').then(m => m.LegalComponent),
    data: { type: 'privacy' }
  },
  {
    path: 'admin',
    loadComponent: () =>
      import('./features/admin/layout/admin-layout.component').then((m) => m.AdminLayoutComponent),
    canActivate: [authGuard],
    children: [
        {
            path: 'dashboard',
            loadComponent: () => import('./features/admin/dashboard/dashboard.component').then(m => m.DashboardComponent)
        },
        {
            path: 'menu',
            loadComponent: () => import('./features/admin/menu/menu-manager.component').then(m => m.MenuManagerComponent)
        },
        {
            path: 'orders',
            loadComponent: () => import('./features/admin/orders/order-kanban.component').then(m => m.OrderKanbanComponent)
        },
        {
            path: 'settings',
            loadComponent: () => import('./features/admin/settings/settings.component').then(m => m.SettingsComponent)
        },
        {
            path: 'analytics',
            loadComponent: () => import('./features/admin/analytics/analytics.component').then(m => m.AnalyticsComponent)
        },
        {
            path: '',
            redirectTo: 'dashboard',
            pathMatch: 'full'
        }
    ]
  },
  // Fallback
  {
      path: '**',
      redirectTo: 'auth/login'
  }
];
