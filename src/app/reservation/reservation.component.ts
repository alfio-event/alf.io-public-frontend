import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html'
})
export class ReservationComponent implements OnInit {

  event: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService) { }

  ngOnInit() {
  }
}
