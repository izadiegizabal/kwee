import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferCreateComponent } from './offer-create.component';

describe('OfferCreateComponent', () => {
  let component: OfferCreateComponent;
  let fixture: ComponentFixture<OfferCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
