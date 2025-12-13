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
import { cpfValidator } from '../../../../shared/validators/cpf.validator';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';


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
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './dashboard-filters.html',
  styleUrl: './dashboard-filters.scss',
})
export class DashboardFilters implements OnInit {
  facade = inject(DashboardFacade);
  faFilter = faFilter;
  faClose = faClose;
  isCpfMode = false;

  filterForm = new FormGroup({
    fuelType: new FormControl<string | null>(null),
    city: new FormControl<string | null>(null),
    vehicleType: new FormControl<string | null>(null),
    searchTerm: new FormControl<string>('', [cpfValidator()])
  });

  ngOnInit(): void {
    this.facade.loadFilterOptions();

    this.searchTermControl?.valueChanges.subscribe(value => {
      this.updateMaskMode(value || '');
    });
  }

  updateMaskMode(value: string) {
    const cleanValue = value.replace(/[^\d]/g, '');
    
    if (cleanValue.length > 0 && value === cleanValue) {
      this.isCpfMode = true;
    } 

    else if (/[a-zA-Z]/.test(value)) {
      this.isCpfMode = false;
    }

    else if (value.length === 0) {
      this.isCpfMode = false;
    }
  }

  applyFilters() {
    if (this.filterForm.invalid) {
      this.filterForm.markAllAsTouched();
      return;
    }

    const formValue = this.filterForm.value;

    let searchTerm = formValue.searchTerm;
    if (searchTerm && this.isCpfMode) {
      searchTerm = searchTerm.replace(/[^\d]/g, '');
    }
  }

  clearFilters() {
    this.filterForm.reset();
    this.isCpfMode = false;
  }

  get searchTermControl() {
    return this.filterForm.get('searchTerm');
  }

  get showCpfError(): boolean {
    const control = this.searchTermControl;
    return !!(control?.invalid && control?.touched && control?.value && this.isCpfMode);
  }
}
