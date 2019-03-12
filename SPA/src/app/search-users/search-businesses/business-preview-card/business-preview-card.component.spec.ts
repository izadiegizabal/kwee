import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BusinessPreviewCardComponent} from './business-preview-card.component';

describe('OfferPreviewCardManageComponent', () => {
  let component: BusinessPreviewCardComponent;
  let fixture: ComponentFixture<BusinessPreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessPreviewCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
