import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../shared/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event, PaymentMethod, PaymentProxy } from 'src/app/model/event';
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

          let paymentProxy : PaymentProxy = null;
          let selectedPaymentMethod: PaymentMethod = null;

          if (!resInfo.orderSummary.free && this.paymentMethodsCount(ev) === 1) {
            selectedPaymentMethod = this.getSinglePaymentMethod(ev);
            paymentProxy = ev.activePaymentMethods[selectedPaymentMethod].paymentProxy;
          }

          this.overviewForm = this.formBuilder.group({
            termAndConditionsAccepted: null,
            privacyPolicyAccepted: null,
            selectedPaymentMethod: selectedPaymentMethod, //<- note: not used by the backend
            paymentMethod: paymentProxy //<- name mismatch for legacy reasons
          });

          // we synchronize the selectedPaymentMethod with the corresponding paymentMethod (which is a payment proxy)
          this.overviewForm.get('selectedPaymentMethod').valueChanges.subscribe(v => {
            this.overviewForm.get('paymentMethod').setValue(ev.activePaymentMethods[v as PaymentMethod].paymentProxy);
          });
        });
      });
    });
  }

  paymentMethodsCount(event: Event) : number {
    return Object.keys(event.activePaymentMethods).length;
  }

  getSinglePaymentMethod(event: Event) : PaymentMethod {
    return (Object.keys(event.activePaymentMethods) as PaymentMethod[])[0];
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