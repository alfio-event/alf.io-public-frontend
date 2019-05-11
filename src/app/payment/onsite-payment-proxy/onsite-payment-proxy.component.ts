import { Component, Input } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';

@Component({
  selector: 'app-onsite-payment-proxy',
  templateUrl: './onsite-payment-proxy.component.html'
})
export class OnsitePaymentProxyComponent {

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  @Input()
  parameters: {[key:string]: any};

  constructor() { }

  public get matchProxyAndMethod(): boolean {
    return this.method === 'ON_SITE' && this.proxy === 'ON_SITE';
  }

}
