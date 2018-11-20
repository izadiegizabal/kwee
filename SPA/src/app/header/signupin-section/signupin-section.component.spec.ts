import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupinSectionComponent } from './signupin-section.component';

describe('SignupinSectionComponent', () => {
  let component: SignupinSectionComponent;
  let fixture: ComponentFixture<SignupinSectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupinSectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupinSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
