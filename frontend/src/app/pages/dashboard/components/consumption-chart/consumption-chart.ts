import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPieChart } from '@fortawesome/free-solid-svg-icons';
import { ChartLegend } from '../../../../shared/components/chart-legend/chart-legend';

@Component({
  selector: 'app-consumption-chart',
  imports: [
    CommonModule, 
    CardModule, 
    ChartModule, 
    ChartLegend,
    FontAwesomeModule
  ],
  templateUrl: './consumption-chart.html',
  styleUrl: './consumption-chart.scss',
})
export class ConsumptionChart {
  faPieChart = faPieChart;
  chartData: any = {
      labels: ['Carros', 'Motos', 'Caminhões', 'Ônibus', 'Vans'],
      datasets: [
        {
          data: [40, 15, 25, 12, 8],
          backgroundColor: [
            '#0f766e', // Carros - teal
            '#f59e0b', // Motos - amber
            '#0e7490', // Caminhões - cyan
            '#10b981', // Ônibus - green
            '#94a3b8'  // Vans - slate
          ],
          borderWidth: 0
        }
      ]
    };

    chartOptions: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false 
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value}%`;
            }
          }
        }
      },
      cutout: '70%'
    };

     legendItems = [
    { label: 'Gasolina', color: '#0f766e' },
    { label: 'Etanol', color: '#f59e0b' },
    { label: 'Diesel', color: '#10b981' }
  ];
}
