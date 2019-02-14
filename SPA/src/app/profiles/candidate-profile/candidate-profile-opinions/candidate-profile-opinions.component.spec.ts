import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateProfileOpinionsComponent } from './candidate-profile-opinions.component';

describe('CandidateProfileOpinionsComponent', () => {
  let component: CandidateProfileOpinionsComponent;
  let fixture: ComponentFixture<CandidateProfileOpinionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateProfileOpinionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateProfileOpinionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
