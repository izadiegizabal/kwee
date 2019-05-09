import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateSettingsComponent } from './candidate-settings.component';

describe('CandidateSettingsComponent', () => {
  let component: CandidateSettingsComponent;
  let fixture: ComponentFixture<CandidateSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CandidateSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
