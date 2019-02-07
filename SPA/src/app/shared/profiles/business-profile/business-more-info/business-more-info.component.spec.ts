import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessMoreInfoComponent } from './business-more-info.component';

describe('BusinessMoreInfoComponent', () => {
  let component: BusinessMoreInfoComponent;
  let fixture: ComponentFixture<BusinessMoreInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessMoreInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
