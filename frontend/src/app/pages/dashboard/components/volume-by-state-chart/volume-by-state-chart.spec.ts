import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VolumeByStateChart } from './volume-by-state-chart';

describe('VolumeByStateChart', () => {
  let component: VolumeByStateChart;
  let fixture: ComponentFixture<VolumeByStateChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VolumeByStateChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VolumeByStateChart);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
