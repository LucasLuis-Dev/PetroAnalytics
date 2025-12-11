import { Component } from '@angular/core';
import { DashboardFilters } from './components/dashboard-filters/dashboard-filters';

@Component({
  selector: 'app-dashboard',
  imports: [DashboardFilters],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard {

}
