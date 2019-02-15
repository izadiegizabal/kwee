import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderbyButtonComponent } from './orderby-button.component';

describe('OrderbyButtonComponent', () => {
  let component: OrderbyButtonComponent;
  let fixture: ComponentFixture<OrderbyButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderbyButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderbyButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
