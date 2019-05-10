import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';

@Component({
  selector: 'app-onsite-payment-proxy',
  templateUrl: './onsite-payment-proxy.component.html',
  styleUrls: ['./onsite-payment-proxy.component.scss']
})
export class OnsitePaymentProxyComponent implements OnInit {

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  constructor() { }

  ngOnInit() {
  }

  public get matchProxyAndMethod(): boolean {
    return this.method === 'ON_SITE' && this.proxy === 'ON_SITE';
  }

}
