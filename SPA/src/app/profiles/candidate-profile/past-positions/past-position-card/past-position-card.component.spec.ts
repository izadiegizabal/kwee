import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PastPositionCardComponent } from './past-position-card.component';

describe('PastPositionCardComponent', () => {
  let component: PastPositionCardComponent;
  let fixture: ComponentFixture<PastPositionCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PastPositionCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastPositionCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
