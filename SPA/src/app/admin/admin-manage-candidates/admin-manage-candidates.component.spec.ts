import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AdminManageCandidatesComponent} from './admin-manage-candidates.component';

describe('AdminManageCandidatesComponent', () => {
  let component: AdminManageCandidatesComponent;
  let fixture: ComponentFixture<AdminManageCandidatesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminManageCandidatesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminManageCandidatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
