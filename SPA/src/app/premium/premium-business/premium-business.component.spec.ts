import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiumBusinessComponent } from './premium-business.component';

describe('PremiumBusinessComponent', () => {
  let component: PremiumBusinessComponent;
  let fixture: ComponentFixture<PremiumBusinessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiumBusinessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiumBusinessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
