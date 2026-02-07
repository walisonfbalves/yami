import { inject } from '@angular/core';
import { Router } from '@angular/router';

export const authGuard = () => {
  const router = inject(Router);
  const token = localStorage.getItem('yami_token');

  if (token) {
    return true;
  }

  return router.parseUrl('/auth/login');
};
