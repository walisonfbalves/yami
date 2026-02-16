import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { StoreService } from '../services/store.service';
import { map, take, tap, filter } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const storeGuard = () => {
  const router = inject(Router);
  const storeService = inject(StoreService);
  const authService = inject(AuthService);

  // Primeiro garante que estamos autenticados
  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/auth/login']);
  }

  return storeService.currentStore$.pipe(
    // Garante que não é o valor inicial undefined (loading)
    filter(store => store !== undefined),
    take(1),
    map(store => {
      // Se não tem loja (null), manda criar
      if (!store) {
        return router.createUrlTree(['/onboarding']);
      }
      // Se tem loja, segue o jogo
      return true;
    })
  );
};

// Guard específico para a rota de onboarding (inverso)
export const onboardingGuard = () => {
    const router = inject(Router);
    const storeService = inject(StoreService);
  
    return storeService.currentStore$.pipe(
      filter(store => store !== undefined),
      take(1),
      map(store => {
        // Se JÁ tem loja, não deve acessar onboarding, vai pro admin
        if (store) {
          return router.createUrlTree(['/admin']);
        }
        return true;
      })
    );
  };
