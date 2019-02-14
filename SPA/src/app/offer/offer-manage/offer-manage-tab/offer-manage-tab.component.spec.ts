import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfferManageTabComponent } from './offer-manage-tab.component';

describe('OfferManageTabComponent', () => {
  let component: OfferManageTabComponent;
  let fixture: ComponentFixture<OfferManageTabComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfferManageTabComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfferManageTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
