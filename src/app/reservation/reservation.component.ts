import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PurchaseContextService, PurchaseContextType} from '../shared/purchase-context.service';
import {PurchaseContext} from '../model/purchase-context';
import {Subscription, zip} from 'rxjs';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html'
})
export class ReservationComponent implements OnInit, OnDestroy {

  private routerSubscription?: Subscription;
  purchaseContext: PurchaseContext;
  type: PurchaseContextType;
  enableLoginButton = false;

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
    this.routerSubscription = this.route.url.subscribe(url => {
      this.enableLoginButton = url[url.length - 1].path === 'success';
    });
  }

  ngOnDestroy(): void {
    this.routerSubscription?.unsubscribe();
  }
}
