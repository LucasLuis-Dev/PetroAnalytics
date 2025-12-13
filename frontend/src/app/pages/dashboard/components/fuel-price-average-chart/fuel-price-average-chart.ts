import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { faChartColumn } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardFacade } from '../../facades/dashboard.facade';

@Component({
  selector: 'app-fuel-price-average-chart',
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    FontAwesomeModule
  ],
  templateUrl: './fuel-price-average-chart.html',
  styleUrl: './fuel-price-average-chart.scss',
})
export class FuelPriceAverageChart implements OnInit {
  facade = inject(DashboardFacade);
  faChartColumn = faChartColumn;
  chartOptions: any;

  chartData = computed(() => {
    const data = this.facade.fuelPriceAverages();
    if (data.length === 0) return null;

    const colorMap: Record<string, string> = {
      'Gasoline': '#0f766e',
      'Ethanol': '#f59e0b',
      'Diesel S10': '#10b981'
    };

    const labels = data.map(item => this.translateFuelType(item.fuel_type));
    const values = data.map(item => item.average_price);
    const colors = data.map(item => colorMap[item.fuel_type] || '#94a3b8');

    return {
      labels: labels,
      datasets: [{
        label: 'Preço Médio',
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
        barThickness: 80
      }]
    };
  });

  ngOnInit() {
    this.initChartOptions();
  }

  initChartOptions() {
    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              return `Preço: R$ ${context.parsed.y.toFixed(2)}`;
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
            color: '#94a3b8',
            font: {
              size: 14
            }
          }
        },
        y: {
          beginAtZero: true,
          max: 7,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#94a3b8',
            stepSize: 2,
            callback: (value: any) => `R$${value}`
          }
        }
      }
    };
  }

  translateFuelType(type: string): string {
    const translations: Record<string, string> = {
      'Gasoline': 'Gasolina',
      'Ethanol': 'Etanol',
      'Diesel S10': 'Diesel'
    };
    return translations[type] || type;
  }
}
