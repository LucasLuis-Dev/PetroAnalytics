import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceEvolutionChart } from './price-evolution-chart';

describe('PriceEvolutionChart', () => {
  let component: PriceEvolutionChart;
  let fixture: ComponentFixture<PriceEvolutionChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PriceEvolutionChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PriceEvolutionChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
