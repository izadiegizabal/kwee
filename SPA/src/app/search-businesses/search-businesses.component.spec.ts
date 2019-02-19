import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchBusinessesComponent } from './search-businesses.component';

describe('SearchBusinessesComponent', () => {
  let component: SearchBusinessesComponent;
  let fixture: ComponentFixture<SearchBusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SearchBusinessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
