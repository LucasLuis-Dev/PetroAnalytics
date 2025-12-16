import { Component, inject, OnInit } from '@angular/core';
import { DashboardFilters } from './components/dashboard-filters/dashboard-filters';
import { DashboardStats } from './components/dashboard-stats/dashboard-stats';
import { Router } from '@angular/router';
import { DashboardCharts } from './components/dashboard-charts/dashboard-charts';
import { FuelRecordTable, TableColumn } from '../../shared/components/fuel-record-table/fuel-record-table';
import { DashboardFacade } from './facades/dashboard.facade';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TablePageEvent } from 'primeng/table';

@Component({
  selector: 'app-dashboard',
  imports: [
    DashboardFilters, 
    DashboardStats, 
    DashboardCharts, 
    FuelRecordTable, 
    FontAwesomeModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  router = inject(Router);
  facade = inject(DashboardFacade);
  faClockRotateLeft = faClockRotateLeft;

  fuelRecordColumns: TableColumn[] = [
    {
      field: 'collection_datetime',
      header: 'Data',
      type: 'date',
      format: 'dd/MM/yyyy'
    },
    {
      field: 'driver_name',
      header: 'Motorista',
      type: 'text'
    },
    {
      field: 'vehicle_type',
      header: 'Veículo',
      type: 'text'
    },
    {
      field: 'fuel_type',
      header: 'Combustível',
      type: 'tag',
    },
    {
      field: 'sold_volume',
      header: 'Qtd (L)',
      type: 'number',
      align: 'right',
      format: '1.1-1'
    },
    {
      field: 'total_value',
      header: 'Valor',
      type: 'currency',
      align: 'right'
    },
    {
      field: 'city',
      header: 'Cidade',
      type: 'text'
    }
  ];

  handlePageChange(event: TablePageEvent) {
    const page = Math.floor(event.first / event.rows) + 1;
    this.facade.loadFuelRecords(page, event.rows);
  }

  ngOnInit(): void {
    this.facade.clearFilters();
    this.facade.loadSummary();
    this.facade.loadKpis();
    this.facade.loadFuelRecords();
  }

  goToHistory() {
    this.router.navigate(['/drivers/record-history']);
  }
}
