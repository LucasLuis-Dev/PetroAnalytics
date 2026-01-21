import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardFilters } from './dashboard-filters';

describe('DashboardFilters', () => {
  let component: DashboardFilters;
  let fixture: ComponentFixture<DashboardFilters>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardFilters]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardFilters);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
