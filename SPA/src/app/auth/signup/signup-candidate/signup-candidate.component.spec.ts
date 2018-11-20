import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignupCandidateComponent } from './signup-candidate.component';

describe('SignupCandidateComponent', () => {
  let component: SignupCandidateComponent;
  let fixture: ComponentFixture<SignupCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignupCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignupCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
