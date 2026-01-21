// src/app/features/drivers/drivers.routes.ts
import { Routes } from '@angular/router';

export const DRIVERS_ROUTES: Routes = [
  {
    path: 'record-history',
    loadComponent: () => import('./pages/drivers-record-history/drivers-record-history')
      .then(m => m.DriversRecordHistory)
  },
];
