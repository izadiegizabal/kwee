import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltersOffererComponent } from './filters-offerer.component';

describe('FiltersOffererComponent', () => {
  let component: FiltersOffererComponent;
  let fixture: ComponentFixture<FiltersOffererComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FiltersOffererComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersOffererComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
