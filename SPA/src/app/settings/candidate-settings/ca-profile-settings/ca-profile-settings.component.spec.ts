import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CaProfileSettingsComponent } from './ca-profile-settings.component';

describe('CaProfileSettingsComponent', () => {
  let component: CaProfileSettingsComponent;
  let fixture: ComponentFixture<CaProfileSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CaProfileSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaProfileSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
