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
      value: this.facade.totalFillings().toLocaleString('pt-BR'),
      icon: this.faGasPump,
      iconColor: '#0f766e'
    },
    {
      title: 'Valor Total Gasto',
      value: `R$ ${this.facade.totalAmount().toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      icon: this.faDollarSign,
      iconColor: '#0284c7'
    },
    {
      title: 'Consumo Total',
      value: `${this.facade.totalVolume().toLocaleString('pt-BR', { maximumFractionDigits: 2 })} L`,
      icon: this.faDroplet,
      iconColor: '#f59e0b'
    },
    {
      title: 'Motoristas Ativos',
      value: this.facade.activeDrivers().toString(),
      icon: this.faUsers,
      iconColor: '#0ea5e9'
    }
  ]);
}
