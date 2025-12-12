import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FuelRecordTable } from './fuel-record-table';

describe('FuelRecordTable', () => {
  let component: FuelRecordTable;
  let fixture: ComponentFixture<FuelRecordTable>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FuelRecordTable]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FuelRecordTable);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
