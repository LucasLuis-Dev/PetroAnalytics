import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { DriversRecordHistory } from './pages/drivers-record-history/drivers-record-history';
import { Auth } from './pages/auth/auth';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'auth', component: Auth },
    { path: 'dashboard', component: Dashboard, canActivate: [authGuard] },
    { path: 'drivers/record-history', component: DriversRecordHistory, canActivate: [authGuard] }
];
