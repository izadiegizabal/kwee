import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ExperienceFormsComponent} from './experience-forms.component';

describe('ExperienceFormsComponent', () => {
  let component: ExperienceFormsComponent;
  let fixture: ComponentFixture<ExperienceFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ExperienceFormsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExperienceFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
