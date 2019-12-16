import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/shared/event.service';
import { I18nService } from 'src/app/shared/i18n.service';
import { ActivatedRoute } from '@angular/router';
import { Event } from 'src/app/model/event';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html'
})
export class ErrorComponent implements OnInit {

  eventShortName: string;
  reservationId: string;
  event: Event;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private i18nService: I18nService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];
      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.event = ev;
        this.i18nService.setPageTitle('reservation-page-not-found.header.title', ev.displayName);
      });
    });
  }

}
