import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { FuelRecord } from '../../../../shared/models/fuel-records.model';
import { DashboardFacade } from '../../facades/dashboard.facade';


@Component({
  selector: 'app-fuel-record-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CardModule,
    ButtonModule,
    FontAwesomeModule
  ],
  templateUrl: './fuel-record-table.html',
  styleUrl: './fuel-record-table.scss',
})
export class FuelRecordTable {
  facade = inject(DashboardFacade);
  faTable = faTable;
  records: FuelRecord[] = []; 

  getFuelTypeSeverity(fuelType: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'Gasolina': 'info',
      'Diesel S10': 'success',
      'Etanol': 'warn'
    };
    return severityMap[fuelType] || 'info';
  }

   onPageChange(event: TablePageEvent) {
    const page = event.first / event.rows + 1;
    this.facade.loadFuelRecords(page, event.rows);
  }

}
