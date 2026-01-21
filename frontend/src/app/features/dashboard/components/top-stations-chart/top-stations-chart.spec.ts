import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopStationsChart } from './top-stations-chart';

describe('TopStationsChart', () => {
  let component: TopStationsChart;
  let fixture: ComponentFixture<TopStationsChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TopStationsChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopStationsChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
