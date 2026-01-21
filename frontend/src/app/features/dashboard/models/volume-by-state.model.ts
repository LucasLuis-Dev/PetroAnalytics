export interface VolumeByStateItem {
  state: string;
  total_volume: number;
}

export interface VolumeByStateResponse {
  items: VolumeByStateItem[];
}