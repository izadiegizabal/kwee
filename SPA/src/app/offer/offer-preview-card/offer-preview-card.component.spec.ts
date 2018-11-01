import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferPreviewCardComponent } from './offer-preview-card.component';

describe('OfferPreviewCardComponent', () => {
  let component: OfferPreviewCardComponent;
  let fixture: ComponentFixture<OfferPreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferPreviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
