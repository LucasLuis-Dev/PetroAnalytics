import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DriverSummary } from '../../models/driver-summary.model';
import { DriverRecordsHistoryFacade } from '../../facades/drivers-records-history.facade';
import { SkeletonModule } from 'primeng/skeleton';
import { PaginatorModule } from 'primeng/paginator';
import { TablePageEvent } from 'primeng/table';


@Component({
  selector: 'app-driver-list',
  imports: [CommonModule, CardModule, SkeletonModule, PaginatorModule],
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.scss',
})
export class DriverList {
  facade = inject(DriverRecordsHistoryFacade);
  onSelectDriver = output<DriverSummary>();
  first: number = 0

  onPageChange(event: any) {
    const page = Math.floor(event.first / event.rows) + 1;
    this.first = event.first;
    this.facade.loadDrivers("",page, event.rows);
  }
}
