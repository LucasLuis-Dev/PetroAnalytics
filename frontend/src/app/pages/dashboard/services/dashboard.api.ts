import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { VehicleVolumeResponse } from '../../../shared/models/vehicle-volume-totals.model';
import { FuelPriceAverageResponse } from '../../../shared/models/fuel-price-averages.model';
import { FuelRecordsResponse, FuelRecord } from '../../../shared/models/fuel-records.model';
import { FilterOptionsResponse } from '../../../shared/models/filter-options.model';
import { FuelSummary } from '../../../shared/models/fuel-summary.model';
import { VolumeByStateResponse } from '../../../shared/models/volume-by-state.model';
import { TopStationsResponse } from '../../../shared/models/top-station.model';
import { DashboardFilters } from '../../../shared/models/dashboard-filter.model'; 

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private http = inject(HttpService);

  getFilterOptions(): Observable<FilterOptionsResponse> {
    return this.http.get<FilterOptionsResponse>('/fuel-records/filter-options');
  }

  getVehicleVolumeTotals(params?: DashboardFilters): Observable<VehicleVolumeResponse> {
    return this.http.get<VehicleVolumeResponse>('/kpis/vehicle-volume-totals', params);
  }

  getFuelPriceAverages(params?: DashboardFilters): Observable<FuelPriceAverageResponse> {
    return this.http.get<FuelPriceAverageResponse>('/kpis/fuel-price-averages', params);
  }

  getFuelRecords(params: {
    page?: number;
    page_size?: number;
    fuel_type?: string;
    city?: string;
    vehicle_type?: string;
  }): Observable<FuelRecordsResponse> {
    return this.http.get<FuelRecordsResponse>('/fuel-records/', params);
  }

  getFuelSummary(params?: DashboardFilters): Observable<FuelSummary> {
    return this.http.get<FuelSummary>('/fuel-records/summary', params);
  }

  getDriverHistory(params: {
    cpf?: string;
    name?: string;
  }) {
    return this.http.get<FuelRecord[]>('/fuel-records/drivers-history', params);
  }

  getVolumeByState(params?: DashboardFilters): Observable<VolumeByStateResponse> {
    return this.http.get<VolumeByStateResponse>('/kpis/state-volumes', params);
  }

  getTopStationsByVolume(params?: DashboardFilters): Observable<TopStationsResponse> {
    return this.http.get<TopStationsResponse>('/kpis/top-stations-by-volume', params);
  }
}