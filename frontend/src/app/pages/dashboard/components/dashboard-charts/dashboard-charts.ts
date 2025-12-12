import { Component } from '@angular/core';
import { ConsumptionChart } from '../consumption-chart/consumption-chart';
import { PriceEvolutionChart } from '../price-evolution-chart/price-evolution-chart';

@Component({
  selector: 'app-dashboard-charts',
  imports: [ConsumptionChart, PriceEvolutionChart],
  templateUrl: './dashboard-charts.html',
  styleUrl: './dashboard-charts.scss',
})
export class DashboardCharts {

}
