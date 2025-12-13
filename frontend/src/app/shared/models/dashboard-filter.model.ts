export interface DashboardFilters {
  fuel_type?: string;
  state?: string;
  city?: string;
  vehicle_type?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}