import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import { ActivatedRoute } from '@angular/router';
import { PurchaseContextService, PurchaseContextType } from '../shared/purchase-context.service';
import { PurchaseContext } from '../model/purchase-context';
import { zip } from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html'
})
export class ReservationComponent implements OnInit {

  purchaseContext: PurchaseContext;
  type: PurchaseContextType;

  constructor(
    private route: ActivatedRoute,
    private purchaseContextService: PurchaseContextService) { }

  ngOnInit() {
    zip(this.route.data, this.route.params).subscribe(([data, params]) => {
      this.purchaseContextService.getContext(data['type'], params[data['publicIdentifierParameter']]).subscribe(purchaseContext => {
        this.type = data['type'];
        this.purchaseContext = purchaseContext;
      });
    });
  }
}
