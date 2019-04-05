import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  event: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getEvent(params['eventShortName']).subscribe(event => {
        this.event = event;
      });
    });
  }

}
