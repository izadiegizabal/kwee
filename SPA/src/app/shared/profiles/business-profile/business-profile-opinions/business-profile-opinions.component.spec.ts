import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessProfileOpinionsComponent } from './business-profile-opinions.component';

describe('BusinessProfileOpinionsComponent', () => {
  let component: BusinessProfileOpinionsComponent;
  let fixture: ComponentFixture<BusinessProfileOpinionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessProfileOpinionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessProfileOpinionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
