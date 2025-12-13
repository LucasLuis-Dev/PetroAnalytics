import { computed, inject, Injectable, signal } from '@angular/core';
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

  totalRefuels = computed(() => {
    const volumes = this.vehicleVolume();
    return volumes.reduce((sum, item) => sum + item.records_count, 0);
  });

  avgPricePerLiter = computed(() => {
    const prices = this.fuelPriceAverages();
    if (prices.length === 0) return 0;
    
    const total = prices.reduce((sum, item) => sum + item.average_price, 0);
    return total / prices.length;
  });

  avgPriceFuelType = computed(() => {
    const prices = this.fuelPriceAverages();
    if (prices.length === 0) return '';
    
    const gasoline = prices.find(p => p.fuel_type === 'Gasoline');
    return gasoline ? 'Gasolina' : '';
  });

  totalConsumption = computed(() => {
    const volumes = this.vehicleVolume();
    return volumes.reduce((sum, item) => sum + item.total_volume, 0);
  });

  activeDrivers = signal(0);

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
        const uniqueDrivers = new Set(res.records.map(r => r.driver_cpf)).size;
        this.activeDrivers.set(uniqueDrivers);
      },
      error: () => this.loadingRecords.set(false),
      complete: () => this.loadingRecords.set(false),
    });
  }

  loadDriverHistory(cpf?: string, name?: string) {
    return this.api.getDriverHistory({ cpf, name });
  }
}