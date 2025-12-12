import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { faArrowTrendUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ChartLegend } from '../../../../shared/components/chart-legend/chart-legend';

@Component({
  selector: 'app-price-evolution-chart',
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    ChartLegend,
    FontAwesomeModule
  ],
  templateUrl: './price-evolution-chart.html',
  styleUrl: './price-evolution-chart.scss',
})
export class PriceEvolutionChart {
  faArrowTrendUp = faArrowTrendUp;
  months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  chartData: any = {
      labels: this.months,
      datasets: [
        {
          label: 'Gasolina',
          data: [5.20, 5.30, 5.45, 5.60, 5.75, 5.85, 5.95, 6.00, 6.10, 6.15, 6.20, 6.25],
          borderColor: '#0f766e',
          backgroundColor: 'rgba(15, 118, 110, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6
        },
        {
          label: 'Etanol',
          data: [3.90, 4.00, 4.10, 4.20, 4.35, 4.45, 4.50, 4.55, 4.60, 4.65, 4.68, 4.70],
          borderColor: '#f59e0b',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6
        },
        {
          label: 'Diesel',
          data: [4.80, 4.90, 5.00, 5.10, 5.20, 5.30, 5.35, 5.38, 5.40, 5.42, 5.43, 5.45],
          borderColor: '#10b981',
          backgroundColor: 'rgba(16, 185, 129, 0.1)',
          tension: 0.4,
          fill: false,
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6
        }
      ]
    };
  chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false 
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (context: any) => {
              return `${context.dataset.label}: R$ ${context.parsed.y.toFixed(2)}`;
            }
          }
        }
      },
      scales: {
        x: {
          grid: {
            display: false
          },
          ticks: {
            color: '#94a3b8'
          }
        },
        y: {
          beginAtZero: false,
          min: 3,
          max: 6.5,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          },
          ticks: {
            color: '#94a3b8',
            callback: (value: any) => `R$${value}`
          }
        }
      },
      interaction: {
        intersect: false,
        mode: 'index'
      }
  };
   legendItems = [
    { label: 'Gasolina', color: '#0f766e' },
    { label: 'Etanol', color: '#f59e0b' },
    { label: 'Diesel', color: '#10b981' }
  ];
}
