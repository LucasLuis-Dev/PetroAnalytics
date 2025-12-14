import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverList } from './driver-list';

describe('DriverList', () => {
  let component: DriverList;
  let fixture: ComponentFixture<DriverList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverList);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
