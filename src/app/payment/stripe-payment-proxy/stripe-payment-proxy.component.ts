import { Component, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PaymentMethod, PaymentProxy, Event } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { TranslateService } from '@ngx-translate/core';
import { PaymentProvider, PaymentResult } from '../payment-provider';
import { Observable, Subscriber } from 'rxjs';
import { ReservationService } from 'src/app/shared/reservation.service';

// global variable defined by stripe when the scripts are loaded
declare const Stripe: any;
declare const StripeCheckout: any;
//

@Component({
  selector: 'app-stripe-payment-proxy',
  templateUrl: './stripe-payment-proxy.component.html',
  styleUrls: ['./stripe-payment-proxy.component.scss']
})
export class StripePaymentProxyComponent implements OnChanges, OnDestroy {

  @Input()
  event: Event;

  @Input()
  reservation: ReservationInfo;

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  @Input()
  parameters: {[key:string]: any};

  @Output()
  paymentProvider: EventEmitter<PaymentProvider> = new EventEmitter<PaymentProvider>();

  constructor(
    private translate: TranslateService,
    private reservationService: ReservationService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.matchProxyAndMethod && changes.method) {
      if(this.parameters['enableSCA']) {
        this.loadSCA();
      } else {
        this.loadNonSCA();
      }
    } else {
      this.unloadAll();
    }
  }

  get useSCA(): boolean {
    return this.parameters && this.parameters['enableSCA'];
  }

  ngOnDestroy(): void {
    this.unloadAll();
  }

  private unloadAll(): void {
    const checkoutScript = document.getElementById(STRIPE_CHECKOUT_ID_SCRIPT);
    if (checkoutScript) {
      checkoutScript.remove();
      delete window['StripeCheckout']; //TODO: check
    }
    const stripeV3Script = document.getElementById(STRIPE_V3_ID_SCRIPT);
    if (stripeV3Script) {
      stripeV3Script.remove();
      delete window['Stripe']; //TODO: check
    }
  }

  private loadNonSCA(): void {
    this.paymentProvider.emit(new StripeCheckoutPaymentProvider(this.translate, this.parameters, this.reservation, this.event));
  }

  public get matchProxyAndMethod(): boolean {
    return this.proxy === 'STRIPE';
  }


  //
  private loadSCA(): void {
    if (!document.getElementById(STRIPE_V3_ID_SCRIPT)) {
      const scriptElem = document.createElement('script');
      scriptElem.id = STRIPE_V3_ID_SCRIPT;
      scriptElem.src = 'https://js.stripe.com/v3/';
      scriptElem.async = true;
      scriptElem.onload = () => {
        this.configureSCA();
      }
      document.body.appendChild(scriptElem);
    } else {
      this.configureSCA();
    }
  }

  private configureSCA() {
    const options = {};
    const stripeHandler = Stripe(this.parameters['stripe_p_key'], options);
    const card = stripeHandler.elements({locale: this.translate.currentLang}).create('card', {style: STRIPE_V3_STYLE});

    card.addEventListener('change', (ev) => {

      //TODO: show errors & co

      if (ev.complete) {
        this.paymentProvider.emit(new StripePaymentV3(this.reservationService, this.event, this.reservation, stripeHandler, card)); // enable payment
      } else {
        this.paymentProvider.emit(null); // -> disable submit buttons by providing an empty payment provider
      }
    });

    card.mount('#card-element');
  }

}


const STRIPE_CHECKOUT_ID_SCRIPT: string = 'stripe-payment-proxy-checkout';

class StripeCheckoutPaymentProvider implements PaymentProvider {

  constructor(
    private translate: TranslateService,
    private parameters: {[key:string]: any},
    private reservation: ReservationInfo,
    private event: Event) {
  }

  pay(): Observable<PaymentResult> {
    const obs = new Observable<PaymentResult>(subscriber => {
      this.loadScript(subscriber);
    });
    return obs;
  }

  loadScript(subscriber: Subscriber<PaymentResult>) {
    if (!document.getElementById(STRIPE_CHECKOUT_ID_SCRIPT)) {
      const scriptElem = document.createElement('script');
      scriptElem.id = STRIPE_CHECKOUT_ID_SCRIPT;
      scriptElem.src = 'https://checkout.stripe.com/checkout.js'
      scriptElem.async = true;
      scriptElem.onload = () => {
        this.configureAndOpen(subscriber);
      }
      document.body.appendChild(scriptElem);
    } else {
      this.configureAndOpen(subscriber);
    }
  }

  configureAndOpen(subscriber: Subscriber<PaymentResult>) {
    let tokenSubmitted = false;
    const stripeHandler = StripeCheckout.configure({
      key: this.parameters['stripe_p_key'],
      locale: this.translate.currentLang,
      token: (token) => {
        tokenSubmitted = true;
        subscriber.next(new PaymentResult(true, token.id));
      },
      closed: () => {
        if (!tokenSubmitted) {
          subscriber.next(new PaymentResult(false, null));
        }
      }
    });
    stripeHandler.open({
      name: `${this.reservation.firstName} ${this.reservation.lastName}`,
      description: this.reservation.orderSummary.descriptionForPayment,
      zipCode: false,
      allowRememberMe: false,
      amount: this.reservation.orderSummary.priceInCents,
      currency: this.event.currency,
      email: this.reservation.email
    });
  }
}

const STRIPE_V3_STYLE = {
  base: {
    color: '#000000',
    /*lineHeight: '18px',*/
    fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
    fontSmoothing: 'antialiased',
    fontSize: '14px',
    '::placeholder': {
      color: '#aab7c4'
    }
  },
  invalid: {
    color: '#a94442',
    iconColor: '#a94442'
  }
};

const STRIPE_V3_ID_SCRIPT = 'stripe-payment-v3-script';

class StripePaymentV3 implements PaymentProvider {

  constructor(
    private reservationService: ReservationService,
    private event: Event,
    private reservation: ReservationInfo,
    private stripeHandler: any,
    private card: any
    ) {
  }

  pay(): Observable<PaymentResult> {

    const obs = new Observable<PaymentResult>(subscriber => {

      this.reservationService.initPayment(this.event.shortName, this.reservation.id).subscribe(res => {
        const clientSecret = res.clientSecret;

        this.stripeHandler.handleCardPayment(clientSecret, this.card, {
          payment_method_data: {
            billing_details: {
                  name: `${this.reservation.firstName} ${this.reservation.lastName}`,
                  email: this.reservation.email,
                  /*address: {
                       line1: stripeEl.getAttribute('data-stripe-contact-address'),
                       postal_code: stripeEl.getAttribute('data-stripe-contact-zip'),
                       country: stripeEl.getAttribute('data-stripe-contact-country').toLowerCase()
                  }*/
              }
          }
        }).then(cardPaymentResult => {
          if(cardPaymentResult.error) {
            console.log('error!');
          } else {
            let handleCheck;
            const checkIfPaid = () => {
              this.reservationService.getPaymentStatus(this.event.shortName, this.reservation.id).subscribe(status => {
                if(status.success) {
                  clearInterval(handleCheck);
                  subscriber.next(new PaymentResult(true, status.gatewayIdOrNull));
                }
                if(status.failed) {
                  subscriber.next(new PaymentResult(false, null));
                }
              });
            }

            handleCheck = setInterval(checkIfPaid, 1000);
          }
        })
      });


    });

    return obs;
  }
}