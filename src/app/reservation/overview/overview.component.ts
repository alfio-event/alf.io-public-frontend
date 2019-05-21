import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../shared/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event, PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { PaymentProvider } from 'src/app/payment/payment-provider';
import { handleServerSideValidationError } from 'src/app/shared/validation-helper';

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

  submitting: boolean;

  selectedPaymentProvider: PaymentProvider;

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

          //
          if (this.reservationInfo.tokenAcquired) {
            paymentProxy = this.reservationInfo.paymentProxy;
            selectedPaymentMethod = this.getPaymentMethodMatchingProxy(ev, paymentProxy);

            // we override and keep only the one selected
            //TODO: kinda ugly, but it works
            let paymentProxyAndParam = this.event.activePaymentMethods[selectedPaymentMethod];
            this.event.activePaymentMethods = {};
            this.event.activePaymentMethods[selectedPaymentMethod] = paymentProxyAndParam
            //
          }
          //

          this.overviewForm = this.formBuilder.group({
            termAndConditionsAccepted: null,
            privacyPolicyAccepted: null,
            selectedPaymentMethod: selectedPaymentMethod, //<- note: not used by the backend
            paymentMethod: paymentProxy, //<- name mismatch for legacy reasons
            gatewayToken: null
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

  getPaymentMethodMatchingProxy(event: Event, paymentProxy: PaymentProxy) : PaymentMethod | null {
    let keys: PaymentMethod[] = Object.keys(event.activePaymentMethods) as PaymentMethod[];
    for(let idx in keys) {
      if(event.activePaymentMethods[keys[idx]].paymentProxy === paymentProxy) {
        return keys[idx];
      }
    }
    return null;
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

  confirm() {
    this.submitting = true;

    this.selectedPaymentProvider.pay().subscribe(paymentResult => {
      console.log(paymentResult);
      if (paymentResult.success) {

        this.overviewForm.get('gatewayToken').setValue(paymentResult.gatewayToken);

        const overviewFormValue = this.overviewForm.value;

        this.reservationService.confirmOverview(this.eventShortName, this.reservationId, overviewFormValue).subscribe(res => {
          if (res.success) {
            if (res.value.redirect) { //handle the case of redirects (e.g. paypal, stripe)
              window.location.href = res.value.redirectUrl;
            } else {
              this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success']);
            }
          } else {
            console.log('res is not success');
            this.submitting = false;
          }
        }, (err) => {
          console.log('error');
          this.submitting = false;
          handleServerSideValidationError(err, this.overviewForm);
        });
      } else {
        console.log('paymentResult is not success (may be cancelled)');
        this.submitting = false;
      }
    });
  }

  handleExpired(expired: boolean) {
    this.expired = expired;
  }

  registerCurrentPaymentProvider(paymentProvider: PaymentProvider) {
    console.log(paymentProvider);
    this.selectedPaymentProvider = paymentProvider;
  }
}