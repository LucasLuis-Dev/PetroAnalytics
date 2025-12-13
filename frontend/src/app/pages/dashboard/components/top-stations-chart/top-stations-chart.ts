import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { faGasPump } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardFacade } from '../../facades/dashboard.facade';


@Component({
  selector: 'app-top-stations-chart',
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    FontAwesomeModule,
  ],
  templateUrl: './top-stations-chart.html',
  styleUrl: './top-stations-chart.scss',
})
export class TopStationsChart {
  facade = inject(DashboardFacade);
  faGasPump = faGasPump;
  chartOptions: any;

  chartData = computed(() => {
    const data = this.facade.topStations();
    if (data.length === 0) return null;

    const labels = data.map(item => item.station_name);
    const values = data.map(item => item.total_volume);

    // Gradiente de cores do mais claro ao mais escuro
    const colors = [
      '#fcd34d', // 5º lugar - azul céu muito claro
      '#a5f3fc', // 4º lugar - azul céu claro
      '#a5b4fc', // 3º lugar - azul médio pastel
      '#fdba74', // 2º lugar - azul vibrante pastel
      '#0891b2'  // 1º lugar - ciano/teal destaque
    ];

    return {
      labels: labels,
      datasets: [{
        label: 'Volume (L)',
        data: values,
        backgroundColor: colors,
        borderRadius: 6,
        barThickness: 30
      }]
    };
  });

  ngOnInit() {
    this.initChartOptions();
  }

  initChartOptions() {
    this.chartOptions = {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: (context: any) => {
              const value = context.parsed.x;
              return `Volume: ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L`;
            }
          }
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#64748b',
            callback: (value: any) => {
              return value.toLocaleString('pt-BR', { maximumFractionDigits: 0 }) + ' L';
            }
          }
        },
        y: {
          grid: {
            display: false
          },
          ticks: {
            color: '#334155',
            font: {
              size: 11,
              weight: '500'
            }
          }
        }
      }
    };
  }

}
