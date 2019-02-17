import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferManageBusinessComponent} from './offer-manage-business.component';

describe('OfferManageBusinessComponent', () => {
  let component: OfferManageBusinessComponent;
  let fixture: ComponentFixture<OfferManageBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfferManageBusinessComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferManageBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
