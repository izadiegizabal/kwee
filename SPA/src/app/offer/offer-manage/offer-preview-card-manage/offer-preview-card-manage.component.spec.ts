import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferPreviewCardManageComponent} from './offer-preview-card-manage.component';

describe('OfferPreviewCardManageComponent', () => {
  let component: OfferPreviewCardManageComponent;
  let fixture: ComponentFixture<OfferPreviewCardManageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfferPreviewCardManageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferPreviewCardManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
