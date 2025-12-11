import { Component } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-dashboard-filters',
  imports: [
    SelectModule, 
    IconFieldModule, 
    InputIconModule, 
    InputTextModule,
    FontAwesomeModule
  ],
  templateUrl: './dashboard-filters.html',
  styleUrl: './dashboard-filters.scss',
})
export class DashboardFilters {
  faFilter = faFilter;
}
