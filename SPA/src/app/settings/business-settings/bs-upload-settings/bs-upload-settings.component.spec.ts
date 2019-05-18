import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsUploadSettingsComponent } from './bs-upload-settings.component';

describe('BsUploadSettingsComponent', () => {
  let component: BsUploadSettingsComponent;
  let fixture: ComponentFixture<BsUploadSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsUploadSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsUploadSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
