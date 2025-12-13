import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  faGasPump, 
  faDollarSign, 
  faDroplet,
  faUsers 
} from '@fortawesome/free-solid-svg-icons';
import { StatsCard } from '../../../../shared/components/stats-card/stats-card';
import { DashboardFacade } from '../../facades/dashboard.facade';

@Component({
  selector: 'app-dashboard-stats',
  imports: [CommonModule, StatsCard],
  templateUrl: './dashboard-stats.html',
  styleUrl: './dashboard-stats.scss',
})
export class DashboardStats {
  facade = inject(DashboardFacade);
  faGasPump = faGasPump;
  faDollarSign = faDollarSign;
  faDroplet = faDroplet;
  faUsers = faUsers;

  stats = computed(() => [
    {
      title: 'Total de Abastecimentos',
      value: this.facade.totalRefuels().toLocaleString('pt-BR'),
      icon: this.faGasPump,
      iconColor: '#0f766e',
      change: {
        value: '+12.5%',
        label: 'este mês',
        type: 'positive' as const
      }
    },
    {
      title: 'Valor Total Gasto',
      value: `R$ ${this.facade.totalSpent().toFixed(2).replace('.', ',')}`,
      icon: this.faDollarSign,
      iconColor: '#0284c7',
      change: {
        value: '3.2%',
        label: this.facade.totalSpent() || 'média geral',
        type: 'negative' as const
      }
    },
    {
      title: 'Consumo Total',
      value: `${this.facade.totalConsumption().toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L`,
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
      value: this.facade.activeDrivers().toString(),
      icon: this.faUsers,
      iconColor: '#0ea5e9',
      change: {
        value: '+5%',
        label: 'cadastrados',
        type: 'positive' as const
      }
    }
  ]);
}
