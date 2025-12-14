import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { DriversRecordHistory } from './pages/drivers-record-history/drivers-record-history';

export const routes: Routes = [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    { path: 'dashboard', component: Dashboard },
    { path: 'drivers/record-history', component: DriversRecordHistory }
];
