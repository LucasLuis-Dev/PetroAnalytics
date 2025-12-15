import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.clearAuth();
        router.navigate(['/auth']);
      }

      if (error.status === 403) {
        console.error('Acesso negado');
      }

      if (error.status === 500) {
        console.error('Erro no servidor');
      }

      return throwError(() => error);
    })
  );
};