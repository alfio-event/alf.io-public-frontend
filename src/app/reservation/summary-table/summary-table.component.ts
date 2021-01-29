import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReservationInfo, SummaryRow } from 'src/app/model/reservation-info';
import { PurchaseContext } from 'src/app/model/purchase-context';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html'
})
export class SummaryTableComponent {

  @Input()
  reservationInfo: ReservationInfo;

  @Input()
  purchaseContext: PurchaseContext;

  @Input()
  displayRemoveSubscription: boolean;

  @Output()
  removeSubscription: EventEmitter<SummaryRow> = new EventEmitter<SummaryRow>();

  constructor() { }

}
