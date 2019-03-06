import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreselectedCandidateCardComponent } from './preselected-candidate-card.component';

describe('PreselectedCandidateCardComponent', () => {
  let component: PreselectedCandidateCardComponent;
  let fixture: ComponentFixture<PreselectedCandidateCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreselectedCandidateCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreselectedCandidateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
