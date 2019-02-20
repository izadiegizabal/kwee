import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OfferManageCandidateComponent} from './offer-manage-candidate.component';

describe('OfferManageCandidateComponent', () => {
  let component: OfferManageCandidateComponent;
  let fixture: ComponentFixture<OfferManageCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OfferManageCandidateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferManageCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
