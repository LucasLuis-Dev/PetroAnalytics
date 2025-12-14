import { Component, computed, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPieChart } from '@fortawesome/free-solid-svg-icons';
import { ChartLegend } from '../../../../shared/components/chart-legend/chart-legend';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { CardHeader } from '../../../../shared/components/card-header/card-header';

@Component({
  selector: 'app-consumption-chart',
  imports: [
    CommonModule, 
    CardModule, 
    ChartModule, 
    ChartLegend,
    FontAwesomeModule,
    CardHeader
  ],
  templateUrl: './consumption-chart.html',
  styleUrl: './consumption-chart.scss',
})
export class ConsumptionChart implements OnInit {
  facade = inject(DashboardFacade);
  faPieChart = faPieChart;
  chartOptions: any;

  chartData = computed(() => {
    const data = this.facade.vehicleVolume();
    if (data.length === 0) return null;

    const colorMap: Record<string, string> = {
      'Carro': '#0f766e',
      'Moto': '#f59e0b',
      'Carreta': '#0e7490',
      'Ônibus': '#10b981',
      'Caminhão Leve': '#94a3b8'
    };

    return {
      labels: data.map(item => item.vehicle_type),
      datasets: [{
        data: data.map(item => item.total_volume),
        backgroundColor: data.map(item => colorMap[item.vehicle_type] || '#94a3b8'),
        borderWidth: 0
      }]
    };
  });

  legendItems = computed(() => {
    const data = this.facade.vehicleVolume();
    if (data.length === 0) return [];

    const total = data.reduce((sum, item) => sum + item.total_volume, 0);
    const colorMap: Record<string, string> = {
      'Carro': '#0f766e',
      'Moto': '#f59e0b',
      'Carreta': '#0e7490',
      'Ônibus': '#10b981',
      'Caminhão Leve': '#94a3b8'
    };

    return data.map(item => ({
      label: item.vehicle_type,
      color: colorMap[item.vehicle_type] || '#94a3b8',
      percentage: ((item.total_volume / total) * 100).toFixed(1) + '%'
    }));
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
              const label = context.label || '';
              const value = context.parsed || 0;
              return `${label}: ${value.toFixed(2)} L`;
            }
          }
        }
      },
      cutout: '70%'
    };
  }
}
