import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CandidateMoreInfoComponent} from './candidate-more-info.component';

describe('CandidateMoreInfoComponent', () => {
  let component: CandidateMoreInfoComponent;
  let fixture: ComponentFixture<CandidateMoreInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateMoreInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidateMoreInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
