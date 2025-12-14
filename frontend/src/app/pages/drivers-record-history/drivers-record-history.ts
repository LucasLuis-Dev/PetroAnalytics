import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faClockRotateLeft } from '@fortawesome/free-solid-svg-icons';
import { DriverSearch } from './components/driver-search/driver-search';
import { DriverRecordsHistoryFacade } from './facades/drivers-records-history.facade';
import { DriverList } from "./components/driver-list/driver-list";

@Component({
  selector: 'app-drivers-record-history',
  imports: [
      FontAwesomeModule,
      DriverSearch,
      DriverList
  ],
  templateUrl: './drivers-record-history.html',
  styleUrl: './drivers-record-history.scss',
})
export class DriversRecordHistory {
  facade = inject(DriverRecordsHistoryFacade);
  faClockRotateLeft = faClockRotateLeft;
  router = inject(Router);

  goBack() {
    this.router.navigate(['/dashboard']);
  }
}
