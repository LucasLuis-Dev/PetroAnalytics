import { Component } from '@angular/core';
import { DashboardFilters } from './components/dashboard-filters/dashboard-filters';
import { DashboardStats } from './components/dashboard-stats/dashboard-stats';
import { DashboardCharts } from './components/dashboard-charts/dashboard-charts';
import { FuelRecordTable } from './components/fuel-record-table/fuel-record-table';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardFilters, DashboardStats, DashboardCharts, FuelRecordTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
