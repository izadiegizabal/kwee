import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CaAccountSettingsComponent} from './ca-account-settings.component';

describe('CaAccountSettingsComponent', () => {
  let component: CaAccountSettingsComponent;
  let fixture: ComponentFixture<CaAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CaAccountSettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
