import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClockRotateLeft, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { DriverSearch } from '../../components/driver-search/driver-search';
import { DriverRecordsHistoryFacade } from '../../facades/drivers-records-history.facade';
import { DriverList } from "../../components/driver-list/driver-list";
import { FuelRecordTable, TableColumn } from '../../../../shared/components/fuel-record-table/fuel-record-table';
import { TablePageEvent } from 'primeng/table';

@Component({
  selector: 'app-drivers-record-history',
  imports: [
      FontAwesomeModule,
      DriverSearch,
      DriverList,
      FuelRecordTable
  ],
  templateUrl: './drivers-record-history.html',
  styleUrl: './drivers-record-history.scss',
})
export class DriversRecordHistory implements OnInit {
  facade = inject(DriverRecordsHistoryFacade);
  faClockRotateLeft = faClockRotateLeft;
  faArrowLeft = faArrowLeft;
  router = inject(Router);

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
    this.facade.loadDriverRecords(page, event.rows);
  }

  ngOnInit(): void {
    this.facade.loadDrivers();
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
