import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from 'src/app/shared/reservation.service';
import { EventService } from 'src/app/shared/event.service';
import { zip } from 'rxjs';
import { Event } from 'src/app/model/event';
import { I18nService } from 'src/app/shared/i18n.service';

@Component({
  selector: 'app-processing-payment',
  templateUrl: './processing-payment.component.html'
})
export class ProcessingPaymentComponent implements OnInit, OnDestroy {

  reservationInfo: ReservationInfo;
  event: Event;

  eventShortName: string;
  reservationId: string;

  private intervalId: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
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

      this.intervalId = setInterval(() => {
        this.reservationService.getReservationStatusInfo(this.eventShortName, this.reservationId).subscribe(res => {
          if (res.status === 'COMPLETE') {
            clearInterval(this.intervalId);
            this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success'])
          }
        });
      }, 2000);
    });
  }

  public ngOnDestroy() {
    clearInterval(this.intervalId);
  }


}
