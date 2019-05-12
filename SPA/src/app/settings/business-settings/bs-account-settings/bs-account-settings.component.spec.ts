import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BsAccountSettingsComponent} from './bs-account-settings.component';

describe('BsAccountSettingsComponent', () => {
  let component: BsAccountSettingsComponent;
  let fixture: ComponentFixture<BsAccountSettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BsAccountSettingsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BsAccountSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
