import { Routes } from '@angular/router';

export const AUTH_ROUTES: Routes = [
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth')
      .then(m => m.Auth)
  },
  {
    path: '',
    redirectTo: 'auth',
    pathMatch: 'full'
  }
];
