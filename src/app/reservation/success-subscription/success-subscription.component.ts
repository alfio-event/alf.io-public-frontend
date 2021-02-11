import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { zip } from 'rxjs';
import { PurchaseContext } from 'src/app/model/purchase-context';
import {ReservationInfo, ReservationSubscriptionInfo} from 'src/app/model/reservation-info';
import { AnalyticsService } from 'src/app/shared/analytics.service';
import { I18nService } from 'src/app/shared/i18n.service';
import { PurchaseContextService, PurchaseContextType } from 'src/app/shared/purchase-context.service';
import { ReservationService } from 'src/app/shared/reservation.service';
import {TranslateService} from '@ngx-translate/core';
import {BasicSubscriptionInfo, SubscriptionInfo} from '../../model/subscription';

@Component({
  selector: 'app-success-subscription',
  templateUrl: './success-subscription.component.html',
  styleUrls: ['./success-subscription.component.scss']
})
export class SuccessSubscriptionComponent implements OnInit {

  private publicIdentifier: string;
  reservationId: string;
  private purchaseContextType: PurchaseContextType;
  purchaseContext: PurchaseContext;
  reservationInfo: ReservationInfo;

  constructor(
    private route: ActivatedRoute,
    private purchaseContextService: PurchaseContextService,
    private i18nService: I18nService,
    private analytics: AnalyticsService,
    private reservationService: ReservationService,
    private translateService: TranslateService
    ) { }

  ngOnInit(): void {
    zip(this.route.data, this.route.params).subscribe(([data, params]) => {

      this.publicIdentifier = params[data.publicIdentifierParameter];
      this.reservationId = params['reservationId'];
      this.purchaseContextType = data.type;

      this.purchaseContextService.getContext(this.purchaseContextType, this.publicIdentifier).subscribe(ev => {
        this.purchaseContext = ev;

        this.i18nService.setPageTitle('reservation-page.header.title', ev);

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

  get purchaseContextTitle(): string {
    return this.purchaseContext.title[this.translateService.currentLang];
  }

  get downloadBillingDocumentVisible(): boolean {
    return this.purchaseContext.invoicingConfiguration.userCanDownloadReceiptOrInvoice
      && this.reservationInfo.paid
      && this.reservationInfo.invoiceOrReceiptDocumentPresent;
  }

  get subscriptionInfo(): ReservationSubscriptionInfo {
    return this.reservationInfo.subscriptionInfos[0];
  }

  public reSendReservationEmail(): void {}

  get subscription(): SubscriptionInfo {
    return this.purchaseContext as SubscriptionInfo;
  }

}
