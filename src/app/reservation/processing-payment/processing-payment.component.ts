import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'src/app/shared/reservation.service';
import { EventService } from 'src/app/shared/event.service';
import { zip } from 'rxjs';
import { Event } from 'src/app/model/event';
import { I18nService } from 'src/app/shared/i18n.service';
import { AnalyticsService } from 'src/app/shared/analytics.service';

@Component({
  selector: 'app-processing-payment',
  templateUrl: './processing-payment.component.html'
})
export class ProcessingPaymentComponent implements OnInit, OnDestroy {

  reservationInfo: ReservationInfo;
  event: Event;

  eventShortName: string;
  reservationId: string;
  forceCheckVisible = false;
  providerWarningVisible = false;
  private forceCheckInProgress = false;

  private intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private eventService: EventService,
    private i18nService: I18nService,
    private analytics: AnalyticsService
    ) { }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      zip(
        this.eventService.getEvent(this.eventShortName),
        this.reservationService.getReservationInfo(this.eventShortName, this.reservationId)
      ).subscribe(([ev, reservationInfo]) => {
        this.event = ev;
        this.reservationInfo = reservationInfo;
        this.i18nService.setPageTitle('show-ticket.header.title', ev.displayName);
        this.analytics.pageView(ev.analyticsConfiguration);
      });

      let checkCount = 0;
      this.intervalId = setInterval(() => {
        const currentStatus = this.reservationInfo.status;
        this.reservationService.getReservationStatusInfo(this.eventShortName, this.reservationId).subscribe(res => {
          checkCount++;
          if (res.status !== currentStatus) {
            clearInterval(this.intervalId);
            this.reservationStateChanged();
          }
          if ((!this.forceCheckVisible || checkCount > 120) && !this.forceCheckInProgress && checkCount % 10 === 0) {
            this.providerWarningVisible = checkCount > 120;
            this.forceCheckVisible = !this.providerWarningVisible;
          }
        });
      }, 2000);
    });
  }
  private reservationStateChanged() {
    // try to navigate to /success. If the reservation is in a different status, the user will be
    // redirected accordingly.
    this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success']);
  }

  public ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  forceCheck(): void {
    this.forceCheckVisible = false;
    this.forceCheckInProgress = true;
    this.reservationService.forcePaymentStatusCheck(this.eventShortName, this.reservationId).subscribe(status => {
      if (status.redirect) {
        window.location.href = status.redirectUrl;
      } else if (status.success || status.failure) {
        this.reservationStateChanged();
      }
      this.forceCheckInProgress = false;
    }, err => {
      console.log('got error', err);
    });
  }


}
