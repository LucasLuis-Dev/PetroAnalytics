export interface FuelPriceAverageItem {
  fuel_type: string;
  average_price: number;
  records_count: number;
}

export interface FuelPriceAverageResponse {
  items: FuelPriceAverageItem[];
}