import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: any;

  constructor(private eventService: EventService) { }

  ngOnInit() {
    this.events = this.eventService.getEvents();
  }

}
