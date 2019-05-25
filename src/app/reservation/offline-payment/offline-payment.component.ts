import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/shared/event.service';
import { ReservationService } from 'src/app/shared/reservation.service';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { Event } from 'src/app/model/event';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n.service';

@Component({
  selector: 'app-offline-payment',
  templateUrl: './offline-payment.component.html',
  styleUrls: ['./offline-payment.component.scss']
})
export class OfflinePaymentComponent implements OnInit {

  reservationInfo: ReservationInfo;
  eventShortName: string;
  reservationId: string;
  paymentReason: string;

  event: Event;

  constructor(
    private route: ActivatedRoute, 
    private eventService: EventService, 
    private reservationService: ReservationService,
    public translate: TranslateService,
    private i18nService: I18nService) { }

  public ngOnInit(): void {

    this.route.parent.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];
      zip(this.eventService.getEvent(this.eventShortName), this.reservationService.getReservationInfo(this.eventShortName, this.reservationId)).subscribe(([ev, reservationInfo]) => {
        this.event = ev;
        this.reservationInfo = reservationInfo;

        this.paymentReason = `<mark>${this.event.shortName} ${this.reservationInfo.shortId}</mark>`;

        this.i18nService.setPageTitle('reservation-page-waiting.header.title', ev.displayName);

      });
    });
  }

}
