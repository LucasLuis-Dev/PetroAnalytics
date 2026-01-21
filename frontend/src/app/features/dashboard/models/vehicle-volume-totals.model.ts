export interface VehicleVolumeItem {
  vehicle_type: string;
  total_volume: number;
  records_count: number;
}

export interface VehicleVolumeResponse {
  items: VehicleVolumeItem[];
}