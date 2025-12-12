import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

interface IChartLegend {
  label: string, 
  color: string
}

@Component({
  selector: 'app-chart-legend',
  imports: [CommonModule],
  templateUrl: './chart-legend.html',
  styleUrl: './chart-legend.scss',
})
export class ChartLegend {
  @Input() legendItems: IChartLegend[] = []
}
