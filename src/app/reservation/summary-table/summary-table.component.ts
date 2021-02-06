import { Component, Input } from '@angular/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { Event } from 'src/app/model/event';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html'
})
export class SummaryTableComponent {

  @Input()
  reservationInfo: ReservationInfo;

  @Input()
  event: Event;

  constructor() { }

  get displaySplitPaymentNote(): boolean {
    return !this.reservationInfo.orderSummary.free
      && this.reservationInfo.billingDetails.invoicingAdditionalInfo?.italianEInvoicing?.splitPayment;
  }

}
