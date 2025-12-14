export interface DriverSummary {
  driver_name: string;
  driver_cpf: string;
  total_fillings: number;
}

export interface DriverSummaryResponse {
  drivers: DriverSummary[];
  total: number;
}