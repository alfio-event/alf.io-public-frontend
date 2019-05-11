import { Component, OnInit, Input } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';

@Component({
  selector: 'app-stripe-payment-proxy',
  templateUrl: './stripe-payment-proxy.component.html',
  styleUrls: ['./stripe-payment-proxy.component.scss']
})
export class StripePaymentProxyComponent implements OnInit {

  @Input()
  reservation: ReservationInfo;

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
    return this.proxy === 'STRIPE';
  }

}
