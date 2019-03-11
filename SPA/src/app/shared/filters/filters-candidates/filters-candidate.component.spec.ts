import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersCandidateComponent } from './filters-candidate.component';

describe('FiltersCandidateComponent', () => {
  let component: FiltersCandidateComponent;
  let fixture: ComponentFixture<FiltersCandidateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersCandidateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersCandidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
