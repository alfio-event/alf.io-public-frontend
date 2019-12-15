import { Component, OnInit } from '@angular/core';
import { I18nService } from 'src/app/shared/i18n.service';
import { ActivatedRoute, Router, UrlSerializer } from '@angular/router';
import { EventService } from 'src/app/shared/event.service';

@Component({
  selector: 'app-not-found',
  templateUrl: './not-found.component.html'
})
export class NotFoundComponent implements OnInit {

  eventShortName: string;
  reservationId: string;
  eventUrl: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private serializer: UrlSerializer,
    private eventService: EventService,
    private i18nService: I18nService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];
      this.eventUrl = this.serializer.serialize(this.router.createUrlTree(['event', this.eventShortName]));
      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.i18nService.setPageTitle('reservation-page-not-found.header.title', ev.displayName);
      });
    });
  }
}
