import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumCandidateComponent } from './premium-candidate.component';

describe('PremiumCandidateComponent', () => {
  let component: PremiumCandidateComponent;
  let fixture: ComponentFixture<PremiumCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
