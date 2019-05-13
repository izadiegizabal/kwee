import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaxApplicationsDialogComponent } from './max-applications-dialog.component';

describe('MaxApplicationsDialogComponent', () => {
  let component: MaxApplicationsDialogComponent;
  let fixture: ComponentFixture<MaxApplicationsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaxApplicationsDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaxApplicationsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
