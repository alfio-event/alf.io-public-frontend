import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';

@Component({
  selector: 'app-paypal-payment-proxy',
  templateUrl: './paypal-payment-proxy.component.html',
  styleUrls: ['./paypal-payment-proxy.component.scss']
})
export class PaypalPaymentProxyComponent implements OnInit {

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  @Input()
  parameters: {[key:string]: any};

  constructor() { }

  ngOnInit() {
  }

  public get matchProxyAndMethod(): boolean {
    return this.proxy === 'PAYPAL';
  }

}
