import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { VehicleVolumeResponse } from '../../../shared/models/vehicle-volume-totals.model';
import { FuelPriceAverageResponse } from '../../../shared/models/fuel-price-averages.model';
import { FuelRecordsResponse, FuelRecord } from '../../../shared/models/fuel-records.model';

@Injectable({ providedIn: 'root' })
export class DashboardApi {
  private http = inject(HttpService);

  getVehicleVolumeTotals(): Observable<VehicleVolumeResponse> {
    return this.http.get<VehicleVolumeResponse>('/kpis/vehicle-volume-totals');
  }

  getFuelPriceAverages(): Observable<FuelPriceAverageResponse> {
    return this.http.get<FuelPriceAverageResponse>('/kpis/fuel-price-averages');
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

  getDriverHistory(params: {
    cpf?: string;
    name?: string;
  }) {
    return this.http.get<FuelRecord[]>('/fuel-records/drivers-history', params);
  }
}