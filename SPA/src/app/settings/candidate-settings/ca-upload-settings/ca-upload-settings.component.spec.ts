import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaUploadSettingsComponent } from './ca-upload-settings.component';

describe('CaUploadSettingsComponent', () => {
  let component: CaUploadSettingsComponent;
  let fixture: ComponentFixture<CaUploadSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaUploadSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaUploadSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
