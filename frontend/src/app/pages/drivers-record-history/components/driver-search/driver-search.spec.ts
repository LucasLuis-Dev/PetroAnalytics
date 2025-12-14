import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DriverSearch } from './driver-search';

describe('DriverSearch', () => {
  let component: DriverSearch;
  let fixture: ComponentFixture<DriverSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DriverSearch]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DriverSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
