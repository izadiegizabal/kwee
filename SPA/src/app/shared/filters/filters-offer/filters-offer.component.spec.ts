import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FiltersOfferComponent} from './filters-offer.component';

describe('FiltersOfferComponent', () => {
  let component: FiltersOfferComponent;
  let fixture: ComponentFixture<FiltersOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiltersOfferComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiltersOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
