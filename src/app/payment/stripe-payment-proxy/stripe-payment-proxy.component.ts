import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';

@Component({
  selector: 'app-stripe-payment-proxy',
  templateUrl: './stripe-payment-proxy.component.html',
  styleUrls: ['./stripe-payment-proxy.component.scss']
})
export class StripePaymentProxyComponent implements OnChanges {

  @Input()
  reservation: ReservationInfo;

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  @Input()
  parameters: {[key:string]: any};

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.matchProxyAndMethod && changes.parameters) {
      console.log(this.parameters);
    }
  }

  public get matchProxyAndMethod(): boolean {
    return this.proxy === 'STRIPE';
  }

}
