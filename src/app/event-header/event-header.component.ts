import { Component, Input } from '@angular/core';
import { Event } from '../model/event';

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss']
})
export class EventHeaderComponent {

  @Input()
  event: Event;

  constructor() { }
}
