import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FiltersBusinessesComponent} from './filters-businesses.component';

describe('FiltersBusinessesComponent', () => {
  let component: FiltersBusinessesComponent;
  let fixture: ComponentFixture<FiltersBusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersBusinessesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
