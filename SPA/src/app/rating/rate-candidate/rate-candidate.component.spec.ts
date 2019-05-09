import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RateCandidateComponent} from './rate-candidate.component';

describe('RateCandidateComponent', () => {
  let component: RateCandidateComponent;
  let fixture: ComponentFixture<RateCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RateCandidateComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
