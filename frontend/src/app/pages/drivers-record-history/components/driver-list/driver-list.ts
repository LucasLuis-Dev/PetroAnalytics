import { Component, inject, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DriverSummary } from '../../../../shared/models/driver-summary.model';
import { DriverRecordsHistoryFacade } from '../../facades/drivers-records-history.facade';


@Component({
  selector: 'app-driver-list',
  imports: [CommonModule, CardModule],
  templateUrl: './driver-list.html',
  styleUrl: './driver-list.scss',
})
export class DriverList {
  facade = inject(DriverRecordsHistoryFacade);
  onSelectDriver = output<DriverSummary>();
}
