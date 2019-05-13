import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { PaymentProvider, SimplePaymentProvider } from '../payment-provider';

@Component({
  selector: 'app-paypal-payment-proxy',
  templateUrl: './paypal-payment-proxy.component.html',
})
export class PaypalPaymentProxyComponent implements OnChanges {

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

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.matchProxyAndMethod && changes.method) {
      console.log('selected paypal');
      this.paymentProvider.emit(new SimplePaymentProvider());
    }
  }

  public get matchProxyAndMethod(): boolean {
    return this.proxy === 'PAYPAL';
  }

}
