import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelPriceAverageChart } from './fuel-price-average-chart';

describe('FuelPriceAverageChart', () => {
  let component: FuelPriceAverageChart;
  let fixture: ComponentFixture<FuelPriceAverageChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelPriceAverageChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelPriceAverageChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
