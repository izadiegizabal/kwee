import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BusinessOpenOffersComponent} from './business-open-offers.component';

describe('BusinessOpenOffersComponent', () => {
  let component: BusinessOpenOffersComponent;
  let fixture: ComponentFixture<BusinessOpenOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BusinessOpenOffersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessOpenOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
