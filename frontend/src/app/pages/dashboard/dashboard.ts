import { Component } from '@angular/core';
import { DashboardFilters } from './components/dashboard-filters/dashboard-filters';
import { DashboardStats } from './components/dashboard-stats/dashboard-stats';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardFilters, DashboardStats],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
