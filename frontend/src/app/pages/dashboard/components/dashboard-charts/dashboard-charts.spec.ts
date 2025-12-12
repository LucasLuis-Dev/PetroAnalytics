import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCharts } from './dashboard-charts';

describe('DashboardCharts', () => {
  let component: DashboardCharts;
  let fixture: ComponentFixture<DashboardCharts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCharts]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCharts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
