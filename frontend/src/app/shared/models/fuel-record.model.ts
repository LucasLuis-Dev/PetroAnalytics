export interface FuelRecord {
  id: number;
  date: Date;
  driver: string;
  vehicle: string;
  fuelType: 'Gasolina' | 'Diesel' | 'Etanol';
  quantity: number;
  totalValue: number;
  city: string;
}