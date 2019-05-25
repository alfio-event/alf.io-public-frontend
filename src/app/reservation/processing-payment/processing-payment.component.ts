import { Component, OnInit } from '@angular/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from 'src/app/shared/reservation.service';
import { EventService } from 'src/app/shared/event.service';
import { zip } from 'rxjs';
import { Event } from 'src/app/model/event';
import { I18nService } from 'src/app/shared/i18n.service';

@Component({
  selector: 'app-processing-payment',
  templateUrl: './processing-payment.component.html'
})
export class ProcessingPaymentComponent implements OnInit {

  reservationInfo: ReservationInfo;
  event: Event;

  eventShortName: string;
  reservationId: string;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private eventService: EventService,
    private i18nService: I18nService
    ) { }

  public ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      zip(this.eventService.getEvent(this.eventShortName), this.reservationService.getReservationInfo(this.eventShortName, this.reservationId)).subscribe(([ev, reservationInfo]) => {
        this.event = ev;
        this.reservationInfo = reservationInfo;
        this.i18nService.setPageTitle('show-ticket.header.title', ev.displayName);
      })
    });
  }

}
