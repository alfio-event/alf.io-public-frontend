import { Component, Input } from '@angular/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { PurchaseContext } from 'src/app/model/purchase-context';

@Component({
  selector: 'app-summary-table',
  templateUrl: './summary-table.component.html'
})
export class SummaryTableComponent {

  @Input()
  reservationInfo: ReservationInfo;

  @Input()
  event: PurchaseContext;

  constructor() { }

}
