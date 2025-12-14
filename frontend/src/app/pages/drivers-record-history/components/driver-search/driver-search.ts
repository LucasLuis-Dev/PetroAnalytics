import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { DriverRecordsHistoryFacade } from '../../facades/drivers-records-history.facade';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-driver-search',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    FontAwesomeModule
  ],
  templateUrl: './driver-search.html',
  styleUrl: './driver-search.scss',
})
export class DriverSearch {
  facade = inject(DriverRecordsHistoryFacade);
  faArrowLeft = faArrowLeft
  searchValue = '';

  onSearchChange(value: string) {
    this.searchValue = value;
    this.facade.searchDrivers(value);
  }

  clearSearch() {
    this.searchValue = '';
    this.facade.clearSearch();
  }
}
