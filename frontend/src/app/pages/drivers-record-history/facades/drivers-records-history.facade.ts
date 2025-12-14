import { computed, inject, Injectable, signal } from '@angular/core';
import { DriverRecordsHistoryApi } from '../services/driver-records-history.api';
import { DriverSummary } from '../../../shared/models/driver-summary.model';
import { FuelRecord, FuelRecordWithTotal } from '../../../shared/models/fuel-records.model';

@Injectable({ providedIn: 'root' })
export class DriverRecordsHistoryFacade {
  private api = inject(DriverRecordsHistoryApi);

  drivers = signal<DriverSummary[]>([]);
  driversTotal = signal(0);
  searchTerm = signal('');
  
  selectedDriver = signal<DriverSummary | null>(null);
  _driverRecords = signal<FuelRecord[]>([]);
  driverRecordsTotal = signal(0);
  driverRecordsPage = signal(1);
  driverRecordsPageSize = signal(10);

  driverRecords = computed<FuelRecordWithTotal[]>(() => {
      return this._driverRecords().map(record => ({
        ...record,
        total_value: this.calculateTotalValue(record)
      }));
  });
  
  loadingDrivers = signal(false);
  loadingRecords = signal(false);
  filteredDrivers = computed(() => {
    const search = this.searchTerm().toLowerCase();
    if (!search) return this.drivers();
    
    return this.drivers().filter(d => 
      d.driver_name.toLowerCase().includes(search) ||
      d.driver_cpf.includes(search)
    );
  });

  private calculateTotalValue(record: FuelRecord): number {
    const price = record.sale_price ?? 0;
    const volume = record.sold_volume ?? 0;
    return price * volume;
  }

  loadDrivers() {
    this.loadingDrivers.set(true);

    this.api.getDriversSummary().subscribe({
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
    this.loadDriverRecords(driver.driver_cpf);
  }

  loadDriverRecords(cpf: string) {
    this.loadingRecords.set(true);

    this.api.getDriverHistory({ cpf }).subscribe({
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
  }

  clearSelection() {
    this.selectedDriver.set(null);
    this._driverRecords.set([]);
  }
}
