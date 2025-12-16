import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';
import { CardModule } from 'primeng/card';
import { SkeletonModule } from 'primeng/skeleton';

export interface StatChange {
  value: string;
  label: string;
  type: 'positive' | 'negative' | 'neutral';
}

@Component({
  selector: 'app-stats-card',
  imports: [CardModule, FontAwesomeModule, CommonModule, SkeletonModule],
  templateUrl: './stats-card.html',
  styleUrl: './stats-card.scss',
})

export class StatsCard {
  @Input() title: string = '';
  @Input() value: string = '';
  @Input() icon!: IconDefinition;
  @Input() iconColor: string = '#000';
  @Input() change?: StatChange;
  @Input() loading: boolean = true
}
