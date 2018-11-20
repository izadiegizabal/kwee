import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupOffererComponent } from './signup-offerer.component';

describe('SignupOffererComponent', () => {
  let component: SignupOffererComponent;
  let fixture: ComponentFixture<SignupOffererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupOffererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupOffererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
