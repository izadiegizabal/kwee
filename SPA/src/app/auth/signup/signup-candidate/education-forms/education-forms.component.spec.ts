import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EducationFormsComponent } from './education-forms.component';

describe('EducationFormsComponent', () => {
  let component: EducationFormsComponent;
  let fixture: ComponentFixture<EducationFormsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EducationFormsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EducationFormsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
