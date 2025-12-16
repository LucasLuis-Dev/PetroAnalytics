import { computed, inject, Injectable, signal } from '@angular/core';
import { DriverRecordsHistoryApi } from '../services/driver-records-history.api';
import { DriverSummary } from '../../../shared/models/driver-summary.model';
import { FuelRecord, FuelRecordWithTotal } from '../../../shared/models/fuel-records.model';
import { debounceTime, distinctUntilChanged, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DriverRecordsHistoryFacade {
   private api = inject(DriverRecordsHistoryApi);
  private searchSubject = new Subject<string>();

  drivers = signal<DriverSummary[]>([]);
  driversTotal = signal(0);
  searchTerm = signal('');
  
  selectedDriver = signal<DriverSummary | null>(null);
  _driverRecords = signal<FuelRecord[]>([]);
  driverRecordsTotal = signal(0);
  driverRecordsPage = signal(1);
  driverRecordsPageSize = signal(20);

  driverRecords = computed<FuelRecordWithTotal[]>(() => {
    return this._driverRecords().map(record => ({
      ...record,
      total_value: this.calculateTotalValue(record)
    }));
  });
  
  loadingDrivers = signal(true);
  loadingRecords = signal(true);

  isSearchingByCpf = computed(() => {
    const term = this.searchTerm();
    const cleanTerm = term.replace(/[^\d]/g, '');
    return cleanTerm.length > 0 && term === cleanTerm;
  });

  constructor() {
    this.searchSubject.pipe(
      debounceTime(500),
      distinctUntilChanged()
    ).subscribe((term: string) => {
      this.performSearch(term);
    });
  }

  private calculateTotalValue(record: FuelRecord): number {
    const price = record.sale_price ?? 0;
    const volume = record.sold_volume ?? 0;
    return price * volume;
  }

  loadDrivers(search?: string, page: number = this.driverRecordsPage(), pageSize: number = this.driverRecordsPageSize()) {
    this.loadingDrivers.set(true);
    this.driverRecordsPage.set(page);
    this.driverRecordsPageSize.set(pageSize);

    const params: { search?: string; page?: number; page_size?: number } = {};
  
    if (search) {
      params.search = search;
    }

    params.page = this.driverRecordsPage();
    params.page_size = this.driverRecordsPageSize();

    this.api.getDriversSummary(params).subscribe({
      next: res => {
        this.drivers.set(res.drivers);
        this.driversTotal.set(res.total);
      },
      error: () => this.loadingDrivers.set(false),
      complete: () => this.loadingDrivers.set(false)
    });
  }

  selectDriver(driver: DriverSummary) {
    this.selectedDriver.set(driver);
    this.driverRecordsPage.set(1);
    this.driverRecordsPageSize.set(10);
    this.loadDriverRecords();
  }

  loadDriverRecords(page: number = this.driverRecordsPage(), pageSize: number = this.driverRecordsPageSize()) {
    this.loadingRecords.set(true);
    this.driverRecordsPage.set(page);
    this.driverRecordsPageSize.set(pageSize);

    const selectedDriver = this.selectedDriver();
    if (!selectedDriver) {
      return;
    }

    const cpf = selectedDriver.cpf;

    const params: { cpf?: string; page?: number; page_size?: number } = {};
  
    if (cpf) {
      params.cpf = cpf;
    }
    
    params.page = this.driverRecordsPage();
    params.page_size = this.driverRecordsPageSize();

    this.api.getDriverHistory(params).subscribe({
      next: res => {
        this._driverRecords.set(res.records);
        this.driverRecordsTotal.set(res.total);
      },
      error: () => this.loadingRecords.set(false),
      complete: () => this.loadingRecords.set(false)
    });
  }


  searchDrivers(term: string) {
    this.searchTerm.set(term);
    this.searchSubject.next(term);
  }

  private performSearch(term: string) {
    const cleanTerm = term.trim();
    
    if (!cleanTerm) {
      this.loadDrivers();
      return;
    }

    const searchValue = cleanTerm.replace(/[^\w\s]/g, '');
    
    this.loadDrivers(searchValue);
  }

  clearSelection() {
    this.selectedDriver.set(null);
    this._driverRecords.set([]);
  }

  clearSearch() {
    this.searchTerm.set('');
    this.loadDrivers();
  }
}
