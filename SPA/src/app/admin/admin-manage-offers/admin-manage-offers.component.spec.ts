import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminManageOffersComponent} from './admin-manage-offers.component';

describe('AdminManageOffersComponent', () => {
  let component: AdminManageOffersComponent;
  let fixture: ComponentFixture<AdminManageOffersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminManageOffersComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
