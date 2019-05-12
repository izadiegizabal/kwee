import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferSelectionProcessComponent} from './offer-selection-process.component';

describe('OfferSelectionProcessComponent', () => {
  let component: OfferSelectionProcessComponent;
  let fixture: ComponentFixture<OfferSelectionProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfferSelectionProcessComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferSelectionProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
