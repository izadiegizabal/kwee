import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CandidatePreviewCardComponent} from './candidate-preview-card.component';

describe('OfferPreviewCardManageComponent', () => {
  let component: CandidatePreviewCardComponent;
  let fixture: ComponentFixture<CandidatePreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CandidatePreviewCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CandidatePreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
