import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IconWithTextComponent } from './icon-with-text.component';

describe('IconWithTextComponent', () => {
  let component: IconWithTextComponent;
  let fixture: ComponentFixture<IconWithTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IconWithTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IconWithTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
