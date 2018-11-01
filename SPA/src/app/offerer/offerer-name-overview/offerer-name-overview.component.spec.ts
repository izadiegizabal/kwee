import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OffererNameOverviewComponent } from './offerer-name-overview.component';

describe('OffererNameOverviewComponent', () => {
  let component: OffererNameOverviewComponent;
  let fixture: ComponentFixture<OffererNameOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OffererNameOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OffererNameOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
