import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EventSummaryComponent } from './event-summary.component';

describe('EventSummaryComponent', () => {
  let component: EventSummaryComponent;
  let fixture: ComponentFixture<EventSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EventSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EventSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
