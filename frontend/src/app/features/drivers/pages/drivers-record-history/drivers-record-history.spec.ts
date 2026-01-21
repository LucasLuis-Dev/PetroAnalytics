import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriversRecordHistory } from './drivers-record-history';

describe('DriversRecordHistory', () => {
  let component: DriversRecordHistory;
  let fixture: ComponentFixture<DriversRecordHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriversRecordHistory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriversRecordHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
