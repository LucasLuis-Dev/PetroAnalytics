export interface FuelRecord {
  id: number;
  station_identifier: string;
  station_name: string;
  city: string;
  state: string;
  collection_datetime: string;
  fuel_type: string;
  sale_price: number;
  sold_volume: number;
  driver_name: string;
  driver_cpf: string;
  vehicle_plate: string;
  vehicle_type: string;
  created_at: string;
}

export interface FuelRecordsResponse {
  total: number;
  page: number;
  page_size: number;
  records: FuelRecord[];
}