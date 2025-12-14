import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { FontAwesomeModule, IconDefinition } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-card-header',
  imports: [CommonModule, FontAwesomeModule],
  templateUrl: './card-header.html',
  styleUrl: './card-header.scss',
})
export class CardHeader {
  icon = input.required<IconDefinition>();
  title = input.required<string>();
  subtitle = input<string>();
  iconColor = input<string>();
}
