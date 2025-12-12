import { inject, Injectable, signal } from '@angular/core';
import { DashboardApi } from '../services/dashboard.api';
import { VehicleVolumeItem } from '../../../shared/models/vehicle-volume-totals.model';
import { FuelPriceAverageItem } from '../../../shared/models/fuel-price-averages.model';
import { FuelRecord } from '../../../shared/models/fuel-records.model';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private api = inject(DashboardApi);

  vehicleVolume = signal<VehicleVolumeItem[]>([]);
  fuelPriceAverages = signal<FuelPriceAverageItem[]>([]);
  fuelRecords = signal<FuelRecord[]>([]);
  fuelRecordsTotal = signal(0);
  fuelRecordsPage = signal(1);
  fuelRecordsPageSize = signal(10);

  loadingKpis = signal(false);
  loadingRecords = signal(false);

  loadKpis() {
    this.loadingKpis.set(true);

    this.api.getVehicleVolumeTotals().subscribe({
      next: res => this.vehicleVolume.set(res.items),
      error: () => this.loadingKpis.set(false),
      complete: () => this.loadingKpis.set(false),
    });

    this.api.getFuelPriceAverages().subscribe({
      next: res => this.fuelPriceAverages.set(res.items),
    });
  }

  loadFuelRecords(page = this.fuelRecordsPage(), pageSize = this.fuelRecordsPageSize()) {
    this.loadingRecords.set(true);
    this.fuelRecordsPage.set(page);
    this.fuelRecordsPageSize.set(pageSize);

    this.api.getFuelRecords({ page, page_size: pageSize }).subscribe({
      next: res => {
        this.fuelRecords.set(res.records);
        this.fuelRecordsTotal.set(res.total);
      },
      error: () => this.loadingRecords.set(false),
      complete: () => this.loadingRecords.set(false),
    });
  }

  loadDriverHistory(cpf?: string, name?: string) {
    return this.api.getDriverHistory({ cpf, name });
  }
}