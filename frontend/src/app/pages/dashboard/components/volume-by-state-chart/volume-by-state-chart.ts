import { Component, inject, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { faMapMarkerAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { CardHeader } from '../../../../shared/components/card-header/card-header';

@Component({
  selector: 'app-volume-by-state-chart',
  imports: [
    CommonModule,
    CardModule,
    ChartModule,
    FontAwesomeModule,
    CardHeader
  ],
  templateUrl: './volume-by-state-chart.html',
  styleUrl: './volume-by-state-chart.scss',
})
export class VolumeByStateChart implements OnInit {
  facade = inject(DashboardFacade);
  faMapMarkerAlt = faMapMarkerAlt;
  chartOptions: any;

  private stateColors: Record<string, string> = {
    // Região Norte (Verde/Azul Pastel)
    'AC': '#86efac', // Acre - Verde pastel
    'AP': '#7dd3fc', // Amapá - Azul céu pastel
    'AM': '#5eead4', // Amazonas - Teal pastel
    'PA': '#a5f3fc', // Pará - Ciano pastel
    'RO': '#6ee7b7', // Rondônia - Verde esmeralda pastel
    'RR': '#99f6e4', // Roraima - Teal claro pastel
    'TO': '#bbf7d0', // Tocantins - Verde limão pastel
    
    // Região Nordeste (Laranja/Amarelo Pastel)
    'AL': '#fcd34d', // Alagoas - Amarelo pastel
    'BA': '#fde68a', // Bahia - Amarelo suave
    'CE': '#fdba74', // Ceará - Laranja pastel
    'MA': '#fed7aa', // Maranhão - Pêssego pastel
    'PB': '#fef3c7', // Paraíba - Creme pastel
    'PE': '#fbbf24', // Pernambuco - Âmbar pastel
    'PI': '#fde047', // Piauí - Amarelo vivo pastel
    'RN': '#fef9c3', // Rio Grande do Norte - Baunilha
    'SE': '#fef08a', // Sergipe - Limão pastel
    
    // Região Centro-Oeste (Roxo Pastel)
    'DF': '#c4b5fd', // Distrito Federal - Lavanda
    'GO': '#d8b4fe', // Goiás - Lilás pastel
    'MT': '#ddd6fe', // Mato Grosso - Violeta pastel
    'MS': '#e9d5ff', // Mato Grosso do Sul - Orquídea pastel
    
    // Região Sudeste (Azul/Cinza Pastel)
    'ES': '#cbd5e1', // Espírito Santo - Cinza azulado pastel
    'MG': '#94a3b8', // Minas Gerais - Slate pastel
    'RJ': '#a5b4fc', // Rio de Janeiro - Índigo pastel
    'SP': '#5eead4', // São Paulo - Teal pastel (destaque)
    
    // Região Sul (Azul Pastel)
    'PR': '#93c5fd', // Paraná - Azul pastel
    'RS': '#bfdbfe', // Rio Grande do Sul - Azul céu claro
    'SC': '#a5b4fc'  // Santa Catarina - Azul lavanda
  };



  chartData = computed(() => {
    const data = this.facade.volumeByState();
    if (data.length === 0) return null;

    // Ordena por volume (maior para menor)
    const sortedData = [...data].sort((a, b) => b.total_volume - a.total_volume);

    const labels = sortedData.map(item => item.state);
    const values = sortedData.map(item => item.total_volume);
    const colors = sortedData.map(item => this.stateColors[item.state] || '#94a3b8');

    return {
      labels: labels,
      datasets: [{
        label: 'Volume (L)',
        data: values,
        backgroundColor: colors,
        borderRadius: 8,
        barThickness: 60
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
              const value = context.parsed.y;
              return `Volume: ${value.toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L`;
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
            color: '#64748b',
            font: {
              size: 12,
              weight: '500'
            }
          }
        },
        y: {
          beginAtZero: true,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)',
            drawBorder: false
          },
          ticks: {
            color: '#64748b',
            callback: (value: any) => {
              // Formata para k (milhares)
              if (value >= 1000) {
                return (value / 1000) + 'k';
              }
              return value;
            }
          }
        }
      }
    };
  }
}
