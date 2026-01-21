import { Component } from '@angular/core';
import { ConsumptionChart } from '../consumption-chart/consumption-chart';
import { FuelPriceAverageChart } from '../fuel-price-average-chart/fuel-price-average-chart';
import { VolumeByStateChart } from '../volume-by-state-chart/volume-by-state-chart';
import { TopStationsChart } from '../top-stations-chart/top-stations-chart';

@Component({
  selector: 'app-dashboard-charts',
  imports: [ConsumptionChart, FuelPriceAverageChart, VolumeByStateChart, TopStationsChart],
  templateUrl: './dashboard-charts.html',
  styleUrl: './dashboard-charts.scss',
})
export class DashboardCharts {

}
