import { computed, inject, Injectable, signal } from '@angular/core';
import { DashboardApi } from '../services/dashboard.api';
import { VehicleVolumeItem } from '../../../shared/models/vehicle-volume-totals.model';
import { FuelPriceAverageItem } from '../../../shared/models/fuel-price-averages.model';
import { FuelRecord, FuelRecordWithTotal } from '../../../shared/models/fuel-records.model';
import { DashboardFilters, FilterOption } from '../../../shared/models/dashboard-filter.model';
import { VolumeByStateItem } from '../../../shared/models/volume-by-state.model';
import { TopStationItem } from '../../../shared/models/top-station.model';
import { forkJoin } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class DashboardFacade {
  private api = inject(DashboardApi);

  fuelTypeOptions = signal<FilterOption[]>([]);
  statesOptions = signal<FilterOption[]>([]);
  cityOptions = signal<FilterOption[]>([]);
  vehicleTypeOptions = signal<FilterOption[]>([]);

  volumeByState = signal<VolumeByStateItem[]>([]);
  topStations = signal<TopStationItem[]>([]);
  vehicleVolume = signal<VehicleVolumeItem[]>([]);
  fuelPriceAverages = signal<FuelPriceAverageItem[]>([]);

  _fuelRecords = signal<FuelRecord[]>([]);
  fuelRecordsTotal = signal(0);
  fuelRecordsPage = signal(1);
  fuelRecordsPageSize = signal(10);

  fuelRecords = computed<FuelRecordWithTotal[]>(() => {
    return this._fuelRecords().map(record => ({
      ...record,
      total_value: this.calculateTotalValue(record)
    }));
  });


  totalVolume = signal(0);
  totalAmount = signal(0);
  activeDrivers = signal(0);
  totalFillings = signal(0);

  loadingKpis = signal(true);
  loadingRecords = signal(true);
  loadingFilterOptions = signal(true);
  loadingSummary = signal(true);

  filtersDashboard = signal<DashboardFilters>({});

  hasActiveFilters = computed(() => {
    const f = this.filtersDashboard();
    return !!(f.fuel_type || f.state || f.city || f.vehicle_type);
  });

  private calculateTotalValue(record: FuelRecord): number {
    const price = record.sale_price ?? 0;
    const volume = record.sold_volume ?? 0;
    return price * volume;
  }

  loadSummary() {
    this.loadingSummary.set(true);

    const filters = this.filtersDashboard();

    this.api.getFuelSummary(filters).subscribe({
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
    const filters = this.filtersDashboard();
    
    forkJoin({
      vehicleVolume: this.api.getVehicleVolumeTotals(filters),
      fuelPriceAverages: this.api.getFuelPriceAverages(filters),
      volumeByState: this.api.getVolumeByState(filters),
      topStations: this.api.getTopStationsByVolume(filters)
    }).subscribe({
      next: (results: any) => {
        this.vehicleVolume.set(results.vehicleVolume.items);
        this.fuelPriceAverages.set(results.fuelPriceAverages.items);
        this.volumeByState.set(results.volumeByState.items);
        this.topStations.set(results.topStations.items);
      },
      error: (err: any) => {
        this.loadingKpis.set(false);
      },
      complete: () => {
        this.loadingKpis.set(false); 
      }
    });
  }

  loadFuelRecords(page = this.fuelRecordsPage(), pageSize = this.fuelRecordsPageSize()) {
    this.loadingRecords.set(true);
    this.fuelRecordsPage.set(page);
    this.fuelRecordsPageSize.set(pageSize);

    const filters = this.filtersDashboard();

    this.api.getFuelRecords({
      page,
      page_size: pageSize,
      ...filters 
    }).subscribe({
      next: res => {
        this._fuelRecords.set(res.records);
        this.fuelRecordsTotal.set(res.total);
      },
      error: () => this.loadingRecords.set(false),
      complete: () => this.loadingRecords.set(false),
    });
  }

  applyFilters(filters: {
    fuelType?: string | null;
    state?: string | null;
    city?: string | null;
    vehicleType?: string | null;
  }) {

    const activeFilters: DashboardFilters= {};

    if (filters.fuelType) {
      activeFilters.fuel_type = filters.fuelType;
    }
    if (filters.state) {
      activeFilters.state = filters.state;
    }
    if (filters.city) {
      activeFilters.city = filters.city;
    }
    if (filters.vehicleType) {
      activeFilters.vehicle_type = filters.vehicleType;
    }

    if (Object.keys(activeFilters).length === 0) {
      return;
    }

    this.filtersDashboard.set(activeFilters);

    this.loadSummary();
    this.loadKpis();
    this.loadFuelRecords(1);
  }

  clearFilters() {
    this.filtersDashboard.set({});
    this.loadSummary();
    this.loadKpis();
    this.loadFuelRecords(1);
  }
}