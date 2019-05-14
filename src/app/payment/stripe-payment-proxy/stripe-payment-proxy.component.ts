import { Component, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PaymentMethod, PaymentProxy, Event } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { TranslateService } from '@ngx-translate/core';
import { PaymentProvider, PaymentResult } from '../payment-provider';
import { Observable, Subscriber } from 'rxjs';

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

  constructor(private translate: TranslateService) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.matchProxyAndMethod && changes.method) {
      console.log(this.parameters);
      if(this.parameters['enableSCA']) {
        this.loadSCA();
      } else {
        this.loadNonSCA();
      }
    } else {
      this.unloadAll();
    }
  }

  ngOnDestroy(): void {
    this.unloadAll();
  }

  private unloadAll(): void {
    const elem = document.getElementById(STRIPE_CHECKOUT_ID_SCRIPT);
    if (elem) {
      elem.remove();
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
    console.log('load ca');
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
    const stripeHandler = window['StripeCheckout'].configure({
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
    console.log('stripe handle open')
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