import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KweeLiveComponent} from './kwee-live.component';

describe('KweeLiveComponent', () => {
  let component: KweeLiveComponent;
  let fixture: ComponentFixture<KweeLiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [KweeLiveComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KweeLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
