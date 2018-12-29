import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SnsShareDialogComponent } from './sns-share-dialog.component';

describe('SnsShareDialogComponent', () => {
  let component: SnsShareDialogComponent;
  let fixture: ComponentFixture<SnsShareDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SnsShareDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnsShareDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
