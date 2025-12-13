export interface DashboardFilters {
  fuelType?: string;
  state?: string;
  city?: string;
  vehicleType?: string;
  searchTerm?: string;
}

export interface FilterOption {
  label: string;
  value: string;
}