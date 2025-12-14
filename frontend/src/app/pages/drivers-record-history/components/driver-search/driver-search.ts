import { Component, computed, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { NgxMaskDirective, provideNgxMask } from 'ngx-mask';

@Component({
  selector: 'app-driver-search',
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    NgxMaskDirective
  ],
  providers: [provideNgxMask()],
  templateUrl: './driver-search.html',
  styleUrl: './driver-search.scss',
})
export class DriverSearch {
  searchValue = model('');
  onSearch = output<string>();
  isCpfMode = false;

  currentMask = computed(() => {
    const value = this.searchValue();
    
    const cleanValue = value.replace(/[^\w]/g, '');
    
    if (/^\d/.test(cleanValue)) {
      return '000.000.000-00';
    }
    
    return '';
  });
}
