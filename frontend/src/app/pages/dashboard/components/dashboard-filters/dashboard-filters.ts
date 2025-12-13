import { Component, inject, OnInit } from '@angular/core';
import { SelectModule } from 'primeng/select';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faFilter, faClose } from '@fortawesome/free-solid-svg-icons';
import { DashboardFacade } from '../../facades/dashboard.facade';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-dashboard-filters',
  imports: [
    CommonModule,
    SelectModule, 
    IconFieldModule, 
    InputIconModule, 
    InputTextModule,
    FontAwesomeModule,
    ReactiveFormsModule,
  ],
  templateUrl: './dashboard-filters.html',
  styleUrl: './dashboard-filters.scss',
})
export class DashboardFilters implements OnInit {
  facade = inject(DashboardFacade);
  faFilter = faFilter;
  faClose = faClose;

  filterForm = new FormGroup({
    fuelType: new FormControl<string | null>(null),
    state: new FormControl<string | null>(null),
    city: new FormControl<string | null>(null),
    vehicleType: new FormControl<string | null>(null),
  });

  ngOnInit(): void {
    this.facade.loadFilterOptions();
  }


  applyFilters() {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    const formValue = this.filterForm.value;
  }

  clearFilters() {
    this.filterForm.reset();
  }

  get searchTermControl() {
    return this.filterForm.get('searchTerm');
  }
}
