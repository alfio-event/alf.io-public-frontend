import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';

@Component({
  selector: 'app-offline-payment-proxy',
  templateUrl: './offline-payment-proxy.component.html',
  styleUrls: ['./offline-payment-proxy.component.scss']
})
export class OfflinePaymentProxyComponent implements OnInit {

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  constructor() { }

  ngOnInit() {
  }

  public get matchProxyAndMethod(): boolean {
    return this.method === 'BANK_TRANSFER' && this.proxy === 'OFFLINE';
  }
}
