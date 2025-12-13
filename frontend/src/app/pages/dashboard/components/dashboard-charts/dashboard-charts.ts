import { Component } from '@angular/core';
import { ConsumptionChart } from '../consumption-chart/consumption-chart';
import { FuelPriceAverageChart } from '../fuel-price-average-chart/fuel-price-average-chart';

@Component({
  selector: 'app-dashboard-charts',
  imports: [ConsumptionChart, FuelPriceAverageChart],
  templateUrl: './dashboard-charts.html',
  styleUrl: './dashboard-charts.scss',
})
export class DashboardCharts {

}
