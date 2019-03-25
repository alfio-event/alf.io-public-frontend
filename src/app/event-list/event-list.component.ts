import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css']
})
export class EventListComponent implements OnInit {

  events: any;

  constructor(private eventService: EventService, private router: Router) { }

  ngOnInit() {
    this.eventService.getEvents().subscribe(res => {
      if(res.singleEvent) {
        this.router.navigate(['/event', res.eventShortName]);
      } else {
        this.events = res.events;
      }
    })
  }

}
