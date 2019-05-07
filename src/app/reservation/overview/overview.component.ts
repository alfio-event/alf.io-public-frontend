import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../shared/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { OverviewConfirmation } from 'src/app/model/overview-confirmation';
import { ReservationInfo } from 'src/app/model/reservation-info';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  reservationInfo: ReservationInfo;
  overviewForm: FormGroup;

  eventShortName: string;
  reservationId: string;
  event: Event;
  expired: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private eventService: EventService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.event = ev;

        this.reservationService.getReservationInfo(this.eventShortName, this.reservationId).subscribe(resInfo => {
          this.reservationInfo = resInfo;

          let paymentMethod = null;

          if (!resInfo.orderSummary.free && ev.activePaymentMethods.length === 1) {
            paymentMethod = ev.activePaymentMethods[0];
          }

          this.overviewForm = this.formBuilder.group({
            termAndConditionsAccepted: null,
            privacyPolicyAccepted: null,
            paymentMethod: paymentMethod
          });
        });
      });
    });
  }

  back() {
    if (this.expired) {
      this.reservationService.cancelPendingReservation(this.eventShortName, this.reservationId).subscribe(res => {
        this.router.navigate(['event', this.eventShortName]);
      });
    } else {
      this.reservationService.backToBooking(this.eventShortName, this.reservationId).subscribe(res => {
        this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'book'])
      });
    }
  }

  confirm(overviewFormValue: OverviewConfirmation) {
    this.reservationService.confirmOverview(this.eventShortName, this.reservationId, overviewFormValue).subscribe(res => {
      if (res.success) {
        this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success']);
      }
    });
  }

  handleExpired(expired: boolean) {
    this.expired = expired;
  }

}
