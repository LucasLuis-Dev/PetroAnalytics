import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartLegend } from './chart-legend';

describe('ChartLegend', () => {
  let component: ChartLegend;
  let fixture: ComponentFixture<ChartLegend>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartLegend]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartLegend);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
