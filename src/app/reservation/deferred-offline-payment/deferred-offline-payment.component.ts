import { Component, OnInit } from '@angular/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { ActivatedRoute } from '@angular/router';
import { EventService } from 'src/app/shared/event.service';
import { ReservationService } from 'src/app/shared/reservation.service';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n.service';
import { AnalyticsService } from 'src/app/shared/analytics.service';
import { zip } from 'rxjs';
import { Event } from 'src/app/model/event';

@Component({
    selector: 'app-deferred-offline-payment',
    templateUrl: './deferred-offline-payment.component.html'
})
export class DeferredOfflinePaymentComponent implements OnInit {

    reservationInfo: ReservationInfo;
    eventShortName: string;
    reservationId: string;
    event: Event;

    constructor(
        private route: ActivatedRoute,
        private eventService: EventService,
        private reservationService: ReservationService,
        public translate: TranslateService,
        private i18nService: I18nService,
        private analytics: AnalyticsService) { }

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.eventShortName = params['eventShortName'];
            this.reservationId = params['reservationId'];
            zip(
              this.eventService.getEvent(this.eventShortName),
              this.reservationService.getReservationInfo(this.eventShortName, this.reservationId)
            ).subscribe(([ev, reservationInfo]) => {
              this.event = ev;
              this.reservationInfo = reservationInfo;
              this.i18nService.setPageTitle('reservation-page-waiting.header.title', ev.displayName);
              this.analytics.pageView(ev.analyticsConfiguration);
            });
          });
    }
}
