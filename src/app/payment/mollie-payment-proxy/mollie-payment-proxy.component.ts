import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { PaymentProvider, SimplePaymentProvider } from '../payment-provider';
import { FormGroup } from '@angular/forms';
import { MolliePaymentProvider } from './mollie-payment-provider';

@Component({
  selector: 'app-mollie-payment-proxy',
  templateUrl: './mollie-payment-proxy.component.html'
})
export class MolliePaymentProxyComponent implements OnChanges {

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  @Input()
  parameters: {[key: string]: any};

  @Input()
  overviewForm: FormGroup;

  @Output()
  paymentProvider: EventEmitter<PaymentProvider> = new EventEmitter<PaymentProvider>();

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.matchProxyAndMethod && changes.method) {
      this.paymentProvider.emit(new MolliePaymentProvider());
    }
  }

  public get matchProxyAndMethod(): boolean {
    return (this.method === 'CREDIT_CARD' || this.method === 'IDEAL') && this.proxy === 'MOLLIE';
  }

}
