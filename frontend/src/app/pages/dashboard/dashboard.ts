import { Component, inject, OnInit } from '@angular/core';
import { DashboardFilters } from './components/dashboard-filters/dashboard-filters';
import { DashboardStats } from './components/dashboard-stats/dashboard-stats';
import { DashboardCharts } from './components/dashboard-charts/dashboard-charts';
import { FuelRecordTable } from './components/fuel-record-table/fuel-record-table';
import { DashboardFacade } from './facades/dashboard.facade';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardFilters, DashboardStats, DashboardCharts, FuelRecordTable],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  facade = inject(DashboardFacade);
  ngOnInit(): void {
    this.facade.loadKpis();
    this.facade.loadFuelRecords();
  }
}
