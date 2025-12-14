import { Component, computed, inject, input, OnInit, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, TablePageEvent } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { FuelRecord } from '../../models/fuel-records.model';
import { CardHeader } from '../card-header/card-header';

export interface TableColumn {
  field: string;
  header: string;
  type?: 'text' | 'date' | 'currency' | 'number' | 'tag';
  align?: 'left' | 'center' | 'right';
  format?: string; // Para date e number
}

@Component({
  selector: 'app-fuel-record-table',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CardModule,
    ButtonModule,
    FontAwesomeModule,
    CardHeader
  ],
  templateUrl: './fuel-record-table.html',
  styleUrl: './fuel-record-table.scss',
})
export class FuelRecordTable {

  data = input.required<any[]>();
  columns = input.required<TableColumn[]>();
  loading = input<boolean>(false);
  totalRecords = input<number>(0);
  pageSize = input<number>(10);
  title = input<string>('Registros');
  subtitle = input<string>('');
  icon = input<IconDefinition>(faTable);
  lazy = input<boolean>(true);
  rowsPerPageOptions = input<number[]>([5, 10, 20]);

  onPageChange = output<TablePageEvent>();
  onRowClick = output<any>();

  faTable = faTable;
  records: FuelRecord[] = []; 

  subtitleText = computed(() => {
    const sub = this.subtitle();
    if (sub) return sub;
    return `${this.totalRecords()} registros encontrados`;
  });

  handlePageChange(event: TablePageEvent) {
    this.onPageChange.emit(event);
  }

  getCellValue(row: any, column: TableColumn): any {
    const value = row[column.field];
    
    if (!value && value !== 0) return '-';
    
    return value;
  }

  getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
  }

  getFuelTypeSeverity(fuelType: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'Gasolina': 'info',
      'Diesel S10': 'success',
      'Etanol': 'warn'
    };
    return severityMap[fuelType] || 'info';
  }
}
