import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../../../core/services/http.service';
import { DriverSummaryResponse } from '../../../shared/models/driver-summary.model';
import { FuelRecordsResponse } from '../../../shared/models/fuel-records.model';

@Injectable({ providedIn: 'root' })
export class DriverRecordsHistoryApi {
  private http = inject(HttpService);

  getDriversSummary(params?: {
    search?: string;
    page?: number;
    page_size?: number;
  }): Observable<DriverSummaryResponse> {
    return this.http.get<DriverSummaryResponse>('/fuel-records/drivers-summary', params);
  }

  getDriverHistory(params: {
    cpf?: string;
    name?: string;
  }): Observable<FuelRecordsResponse> {
    return this.http.get<FuelRecordsResponse>('/fuel-records/drivers-history', params);
  }
}