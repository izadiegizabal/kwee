import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessesPreviewCardComponent } from './businesses-preview-card.component';

describe('BusinessesPreviewCardComponent', () => {
  let component: BusinessesPreviewCardComponent;
  let fixture: ComponentFixture<BusinessesPreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessesPreviewCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessesPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
