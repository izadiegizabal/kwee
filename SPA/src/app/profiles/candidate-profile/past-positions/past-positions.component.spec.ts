import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PastPositionsComponent} from './past-positions.component';

describe('PastPositionsComponent', () => {
  let component: PastPositionsComponent;
  let fixture: ComponentFixture<PastPositionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PastPositionsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PastPositionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
