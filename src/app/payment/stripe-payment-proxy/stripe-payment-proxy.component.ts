import { Component, Input, OnChanges, SimpleChanges, OnDestroy, Output, EventEmitter } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { TranslateService } from '@ngx-translate/core';
import { PaymentProvider } from '../payment-provider';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-stripe-payment-proxy',
  templateUrl: './stripe-payment-proxy.component.html',
  styleUrls: ['./stripe-payment-proxy.component.scss']
})
export class StripePaymentProxyComponent implements OnChanges, OnDestroy {

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
        this.loadCA();
      } else {
        this.loadNonCA();
      }
    } else {
      this.unloadAll();
    }
  }

  ngOnDestroy(): void {
    this.unloadAll();
  }

  private unloadAll(): void {
    console.log('unload all');

    const elem = document.getElementById(STRIPE_CHECKOUT_ID_SCRIPT);
    if(elem) {
      elem.remove();
    }
  }

  private loadNonCA(): void {
    console.log('load non ca');

    this.paymentProvider.emit(new StripeCheckoutPaymentProvider());
  }

  public get matchProxyAndMethod(): boolean {
    return this.proxy === 'STRIPE';
  }


  //
  private loadCA(): void {
    console.log('load ca');
  }

}

class StripeCheckoutPaymentProvider implements PaymentProvider {

  get ready(): Observable<boolean> {
    return of(false);
  }

  /*
  
  
  const scriptElem = document.createElement('script');
    scriptElem.id = STRIPE_CHECKOUT_ID_SCRIPT;
    scriptElem.src = 'https://checkout.stripe.com/checkout.js'
    scriptElem.async = true;
    scriptElem.onload = () => {
      //;
      console.log('script loaded!');
      console.log(this.parameters);
      const stripeHandler = window['StripeCheckout'].configure({
        key: this.parameters['stripe_p_key'],
        locale: this.translate.currentLang,
        token: (token) => {
          console.log('token is', token)
        },
        closed: () => {
        }



      });
      

    }

    document.body.appendChild(scriptElem);
  
  
  
  */
}

const STRIPE_CHECKOUT_ID_SCRIPT: string = 'stripe-payment-proxy-checkout';