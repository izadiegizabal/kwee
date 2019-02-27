import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserPreviewCardComponent} from './user-preview-card.component';

describe('OfferPreviewCardManageComponent', () => {
  let component: UserPreviewCardComponent;
  let fixture: ComponentFixture<UserPreviewCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserPreviewCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserPreviewCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
