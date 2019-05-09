import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BsProfileSettingsComponent } from './bs-profile-settings.component';

describe('BsProfileSettingsComponent', () => {
  let component: BsProfileSettingsComponent;
  let fixture: ComponentFixture<BsProfileSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BsProfileSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
