export interface TopStationItem {
  station_identifier: string;
  station_name: string;
  total_volume: number;
}

export interface TopStationsResponse {
  items: TopStationItem[];
}