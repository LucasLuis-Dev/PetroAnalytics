import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { DriversRecordHistory } from './pages/drivers-record-history/drivers-record-history';
import { Auth } from './pages/auth/auth';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  { 
    path: '', 
    redirectTo: 'dashboard', 
    pathMatch: 'full' 
  },
  { 
    path: 'auth', 
    loadComponent: () => import('./pages/auth/auth').then(m => m.Auth)
  },
  { 
    path: 'dashboard', 
    loadComponent: () => import('./pages/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [authGuard]
  },
  { 
    path: 'drivers/record-history', 
    loadComponent: () => import('./pages/drivers-record-history/drivers-record-history').then(m => m.DriversRecordHistory),
    canActivate: [authGuard]
  }
];