import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  faGasPump, 
  faDollarSign, 
  faDroplet,
  faUsers 
} from '@fortawesome/free-solid-svg-icons';
import { StatsCard } from '../stats-card/stats-card';

@Component({
  selector: 'app-dashboard-stats',
  imports: [CommonModule, StatsCard],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.scss',
})
export class DashboardStats {
  faGasPump = faGasPump;
  faDollarSign = faDollarSign;
  faDroplet = faDroplet;
  faUsers = faUsers;

   stats = [
    {
      title: 'Total de Abastecimentos',
      value: '1.234',
      icon: this.faGasPump,
      iconColor: '#0f766e',
      change: {
        value: '+12.5%',
        label: 'este mês',
        type: 'positive' as const
      }
    },
    {
      title: 'Média Preço/Litro',
      value: 'R$ 5,89',
      icon: this.faDollarSign,
      iconColor: '#0284c7',
      change: {
        value: '3.2%',
        label: 'gasolina comum',
        type: 'negative' as const
      }
    },
    {
      title: 'Consumo Total',
      value: '45.678 L',
      icon: this.faDroplet,
      iconColor: '#f59e0b',
      change: {
        value: '+8.1%',
        label: 'no período',
        type: 'positive' as const
      }
    },
    {
      title: 'Motoristas Ativos',
      value: '89',
      icon: this.faUsers,
      iconColor: '#0ea5e9',
      change: {
        value: '+5%',
        label: 'cadastrados',
        type: 'positive' as const
      }
    }
  ];
}
