import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardHeader } from './card-header';

describe('CardHeader', () => {
  let component: CardHeader;
  let fixture: ComponentFixture<CardHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CardHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CardHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
