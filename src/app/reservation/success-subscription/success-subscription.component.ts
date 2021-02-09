import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import { PurchaseContext } from 'src/app/model/purchase-context';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { AnalyticsService } from 'src/app/shared/analytics.service';
import { I18nService } from 'src/app/shared/i18n.service';
import { PurchaseContextService, PurchaseContextType } from 'src/app/shared/purchase-context.service';
import { ReservationService } from 'src/app/shared/reservation.service';

@Component({
  selector: 'app-success-subscription',
  templateUrl: './success-subscription.component.html',
  styleUrls: ['./success-subscription.component.scss']
})
export class SuccessSubscriptionComponent implements OnInit {

  private publicIdentifier: string;
  private reservationId: string;
  private purchaseContextType: PurchaseContextType;
  purchaseContext: PurchaseContext;
  reservationInfo: ReservationInfo;

  constructor(
    private route: ActivatedRoute,
    private purchaseContextService: PurchaseContextService,
    private i18nService: I18nService,
    private analytics: AnalyticsService,
    private reservationService: ReservationService
    ) { }

  ngOnInit(): void {
    zip(this.route.data, this.route.params).subscribe(([data, params]) => {

      this.publicIdentifier = params[data.publicIdentifierParameter];
      this.reservationId = params['reservationId'];
      this.purchaseContextType = data.type;

      this.purchaseContextService.getContext(this.purchaseContextType, this.publicIdentifier).subscribe(ev => {
        this.purchaseContext = ev;

        this.i18nService.setPageTitle('reservation-page.header.title', ev.displayName);

        this.loadReservation();

        this.analytics.pageView(ev.analyticsConfiguration);
      });
    });
  }

  private loadReservation() {
    this.reservationService.getReservationInfo(this.reservationId).subscribe(resInfo => {
      this.reservationInfo = resInfo;
    });
  }

}
