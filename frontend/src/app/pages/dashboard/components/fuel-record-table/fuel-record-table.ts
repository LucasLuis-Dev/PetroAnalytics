import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faTable } from '@fortawesome/free-solid-svg-icons';
import { FuelRecord } from '../../../../shared/models/fuel-record.model';


@Component({
  selector: 'app-fuel-record-table',
  imports: [
    CommonModule,
    TableModule,
    TagModule,
    CardModule,
    ButtonModule,
    FontAwesomeModule
  ],
  templateUrl: './fuel-record-table.html',
  styleUrl: './fuel-record-table.scss',
})
export class FuelRecordTable implements OnInit {
  faTable = faTable;
  records: FuelRecord[] = []; 
  loading: boolean = false;

  ngOnInit() {
    this.loadRecords();
  }

  loadRecords() {
    this.loading = true;
    
    this.records = [
      {
        id: 1,
        date: new Date('2024-01-14'),
        driver: 'Carlos Silva',
        vehicle: 'Carro',
        fuelType: 'Gasolina',
        quantity: 45.5,
        totalValue: 268.04,
        city: 'São Paulo'
      },
      {
        id: 2,
        date: new Date('2024-01-14'),
        driver: 'Maria Santos',
        vehicle: 'Moto',
        fuelType: 'Gasolina',
        quantity: 12.3,
        totalValue: 72.45,
        city: 'Rio de Janeiro'
      },
      {
        id: 3,
        date: new Date('2024-01-13'),
        driver: 'João Pereira',
        vehicle: 'Caminhão',
        fuelType: 'Diesel',
        quantity: 250.0,
        totalValue: 1375.00,
        city: 'Belo Horizonte'
      },
      {
        id: 4,
        date: new Date('2024-01-13'),
        driver: 'Ana Costa',
        vehicle: 'Van',
        fuelType: 'Diesel',
        quantity: 65.8,
        totalValue: 362.09,
        city: 'Curitiba'
      },
      {
        id: 5,
        date: new Date('2024-01-12'),
        driver: 'Pedro Lima',
        vehicle: 'Carro',
        fuelType: 'Etanol',
        quantity: 38.2,
        totalValue: 163.29,
        city: 'Porto Alegre'
      }
    ];

    this.loading = false;
  }

  getFuelTypeSeverity(fuelType: string): 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast' {
    const severityMap: Record<string, 'success' | 'info' | 'warn' | 'danger' | 'secondary' | 'contrast'> = {
      'Gasolina': 'info',
      'Diesel': 'success',
      'Etanol': 'warn'
    };
    return severityMap[fuelType] || 'info';
  }

}
