import { computed, inject, Injectable, signal } from '@angular/core';
import { DashboardApi } from '../services/dashboard.api';
import { VehicleVolumeItem } from '../../../shared/models/vehicle-volume-totals.model';
import { FuelPriceAverageItem } from '../../../shared/models/fuel-price-averages.model';
import { FuelRecord } from '../../../shared/models/fuel-records.model';
import { FilterOption } from '../../../shared/models/dashboard-filter.model';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private api = inject(DashboardApi);

  fuelTypeOptions = signal<FilterOption[]>([]);
  statesOptions = signal<FilterOption[]>([]);
  cityOptions = signal<FilterOption[]>([]);
  vehicleTypeOptions = signal<FilterOption[]>([]);

  vehicleVolume = signal<VehicleVolumeItem[]>([]);
  fuelPriceAverages = signal<FuelPriceAverageItem[]>([]);
  fuelRecords = signal<FuelRecord[]>([]);
  fuelRecordsTotal = signal(0);
  fuelRecordsPage = signal(1);
  fuelRecordsPageSize = signal(10);

  totalVolume = signal(0);
  totalAmount = signal(0);
  activeDrivers = signal(0);
  totalFillings = signal(0);

  loadingKpis = signal(false);
  loadingRecords = signal(false);
  loadingFilterOptions = signal(false);
  loadingSummary = signal(false);

  loadSummary() {
    this.loadingSummary.set(true);

    this.api.getFuelSummary().subscribe({
      next: res => {
        this.totalVolume.set(res.total_volume);
        this.totalAmount.set(res.total_amount);
        this.activeDrivers.set(res.active_drivers);
        this.totalFillings.set(res.total_fillings);
      },
      error: () => this.loadingSummary.set(false),
      complete: () => this.loadingSummary.set(false),
    });
  }

  loadFilterOptions() {
    this.loadingFilterOptions.set(true);
    
    this.api.getFilterOptions().subscribe({
      next: res => {
        this.fuelTypeOptions.set(
          res.fuel_types.map(ft => ({ 
            label: ft, 
            value: ft 
          }))
        );

        this.statesOptions.set(
          res.states.map(state => ({ 
            label: state, 
            value: state 
          }))
        );

        this.cityOptions.set(
          res.cities.map(city => ({ 
            label: city, 
            value: city 
          }))
        );

        this.vehicleTypeOptions.set(
          res.vehicle_types.map(vt => ({ 
            label: vt, 
            value: vt 
          }))
        );

        this.loadingFilterOptions.set(false);
      },
      error: () => {
        this.loadingFilterOptions.set(false);
      }
    });
  }

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