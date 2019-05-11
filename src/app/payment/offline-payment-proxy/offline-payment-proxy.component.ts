import { Component, Input } from '@angular/core';
import { PaymentMethod, PaymentProxy } from 'src/app/model/event';
import { ReservationInfo } from 'src/app/model/reservation-info';

@Component({
  selector: 'app-offline-payment-proxy',
  templateUrl: './offline-payment-proxy.component.html'
})
export class OfflinePaymentProxyComponent {

  @Input()
  reservation: ReservationInfo;

  @Input()
  method: PaymentMethod;

  @Input()
  proxy: PaymentProxy;

  @Input()
  parameters: {[key:string]: any};

  constructor() { }

  public get matchProxyAndMethod(): boolean {
    return this.method === 'BANK_TRANSFER' && this.proxy === 'OFFLINE';
  }
}
