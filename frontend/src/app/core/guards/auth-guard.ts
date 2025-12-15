import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();
  
  if (token) {
    if (!authService.isAuthenticated()) {
      authService.isAuthenticated.set(true);
    }
    return true;
  }
  
  router.navigate(['/auth']);
  return false;
};