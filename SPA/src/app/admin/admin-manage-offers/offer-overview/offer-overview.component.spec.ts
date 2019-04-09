import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferOverviewComponent } from './offer-overview.component';

describe('OfferOverviewComponent', () => {
  let component: OfferOverviewComponent;
  let fixture: ComponentFixture<OfferOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
