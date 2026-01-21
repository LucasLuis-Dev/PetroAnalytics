export interface DriverSummary {
  name: string;
  cpf: string;
  total_fillings: number;
}

export interface DriverSummaryResponse {
  drivers: DriverSummary[];
  total: number;
}