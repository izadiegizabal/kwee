import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminManageBusinessesComponent } from './admin-manage-businesses.component';

describe('AdminManageBusinessesComponent', () => {
  let component: AdminManageBusinessesComponent;
  let fixture: ComponentFixture<AdminManageBusinessesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminManageBusinessesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageBusinessesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
