import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.css']
})
export class EventDisplayComponent implements OnInit {

  constructor(private route: ActivatedRoute, private eventService: EventService) { }

  event: any;

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getEvent(params['eventShortName']).subscribe(e => {
        this.event = e;
      })
    })
  }

}
