import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventDisplayComponent } from './event-display.component';

describe('EventDisplayComponent', () => {
  let component: EventDisplayComponent;
  let fixture: ComponentFixture<EventDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
