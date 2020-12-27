import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { HttpClientModule, HttpClientXsrfModule, HttpClient } from '@angular/common/http';

import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faInfoCircle, faGift, faTicketAlt, faCheck, faAddressCard, faFileAlt, faThumbsUp, faMoneyBill, faDownload, faSearchPlus,
  faExchangeAlt, faExclamationTriangle, faCreditCard, faCog, faEraser, faTimes, faFileInvoice, faGlobe,
  faAngleDown, faAngleUp, faCircle, faMoneyCheckAlt, faWifi } from '@fortawesome/free-solid-svg-icons';
import {
  faCalendarAlt, faCalendarPlus, faCompass, faClock, faEnvelope,
  faEdit, faClone, faHandshake, faBuilding, faCheckCircle } from '@fortawesome/free-regular-svg-icons';
import { faPaypal, faStripe, faApplePay, faIdeal } from '@fortawesome/free-brands-svg-icons';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbTooltipModule, NgbModalModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { BookingComponent } from './reservation/booking/booking.component';
import { OverviewComponent } from './reservation/overview/overview.component';
import { SuccessComponent } from './reservation/success/success.component';
import { ReservationComponent } from './reservation/reservation.component';
import { StepperComponent } from './stepper/stepper.component';
import { AdditionalFieldComponent } from './additional-field/additional-field.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { UpdateTicketComponent } from './update-ticket/update-ticket.component';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { TicketFormComponent } from './reservation/ticket-form/ticket-form.component';
import { CountdownComponent } from './countdown/countdown.component';
import { BannerCheckComponent } from './banner-check/banner-check.component';
import { OfflinePaymentComponent } from './reservation/offline-payment/offline-payment.component';
import { OfflinePaymentProxyComponent } from './payment/offline-payment-proxy/offline-payment-proxy.component';
import { OnsitePaymentProxyComponent } from './payment/onsite-payment-proxy/onsite-payment-proxy.component';
import { PaypalPaymentProxyComponent } from './payment/paypal-payment-proxy/paypal-payment-proxy.component';
import { StripePaymentProxyComponent } from './payment/stripe-payment-proxy/stripe-payment-proxy.component';
import { SaferpayPaymentProxyComponent } from './payment/saferpay-payment-proxy/saferpay-payment-proxy.component';
import { ProcessingPaymentComponent } from './reservation/processing-payment/processing-payment.component';
import { SummaryTableComponent } from './reservation/summary-table/summary-table.component';
import { InvoiceFormComponent } from './reservation/invoice-form/invoice-form.component';
import { AdditionalServiceComponent } from './additional-service/additional-service.component';
import { RecaptchaComponent } from './recaptcha/recaptcha.component';
import { CustomLoader } from './shared/i18n.service';
import { NotFoundComponent } from './reservation/not-found/not-found.component';
import { PriceTagComponent } from './price-tag/price-tag.component';
import { TicketQuantitySelectorComponent } from './ticket-quantity-selector/ticket-quantity-selector.component';
import { ItemSalePeriodComponent } from './category-sale-period/item-sale-period.component';
import { ItemCardComponent } from './item-card/item-card.component';
import { AdditionalServiceQuantitySelectorComponent } from './additional-service-quantity-selector/additional-service-quantity-selector.component';
import { ReservationExpiredComponent } from './reservation/expired-notification/reservation-expired.component';
import { ReleaseTicketComponent } from './reservation/release-ticket/release-ticket.component';
import { CancelReservationComponent } from './reservation/cancel-reservation/cancel-reservation.component';
import { EventFooterLinksComponent } from './event-footer-links/event-footer-links.component';
import { ErrorComponent } from './reservation/error/error.component';
import { DeferredOfflinePaymentComponent } from './reservation/deferred-offline-payment/deferred-offline-payment.component';
import { MolliePaymentProxyComponent } from './payment/mollie-payment-proxy/mollie-payment-proxy.component';
import { PaymentMethodSelectorComponent } from './reservation/payment-method-selector/payment-method-selector.component';
import { AnimatedDotsComponent } from './reservation/animated-dots/animated-dots.component';
import { EventDatesComponent } from './event-dates/event-dates.component';
import { SharedModule } from './shared/shared.module';
import { EventListAllComponent } from './event-list-all/event-list-all.component';
import { BasicEventInfoComponent } from './basic-event-info/basic-event-info.component';
import { SubscriptionListAllComponent } from './subscription-list-all/subscription-list-all.component';



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    EventDisplayComponent,
    BookingComponent,
    OverviewComponent,
    SuccessComponent,
    ReservationComponent,

    StepperComponent,
    AdditionalFieldComponent,
    ViewTicketComponent,
    UpdateTicketComponent,
    EventSummaryComponent,
    TicketFormComponent,
    CountdownComponent,
    BannerCheckComponent,
    OfflinePaymentComponent,
    OfflinePaymentProxyComponent,
    OnsitePaymentProxyComponent,
    PaypalPaymentProxyComponent,
    StripePaymentProxyComponent,
    SaferpayPaymentProxyComponent,
    ProcessingPaymentComponent,
    SummaryTableComponent,
    InvoiceFormComponent,
    AdditionalServiceComponent,
    RecaptchaComponent,
    PriceTagComponent,
    NotFoundComponent,
    TicketQuantitySelectorComponent,
    ItemSalePeriodComponent,
    ItemCardComponent,
    AdditionalServiceQuantitySelectorComponent,
    ReservationExpiredComponent,
    ReleaseTicketComponent,
    CancelReservationComponent,
    EventFooterLinksComponent,
    ErrorComponent,
    DeferredOfflinePaymentComponent,
    MolliePaymentProxyComponent,
    PaymentMethodSelectorComponent,
    AnimatedDotsComponent,
    EventDatesComponent,
    EventListAllComponent,
    BasicEventInfoComponent,
    SubscriptionListAllComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN',
    }),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
    }),
    NgbTooltipModule,
    NgSelectModule,
    NgbModalModule,
    NgbDropdownModule,
    SharedModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ReservationExpiredComponent, ReleaseTicketComponent, CancelReservationComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faInfoCircle, faGift, faTicketAlt, faCheck, faAddressCard, faFileAlt, faThumbsUp, faMoneyBill,
      faDownload, faSearchPlus, faExchangeAlt, faExclamationTriangle, faCreditCard, faCog, faEraser, faTimes, faFileInvoice, faGlobe,
      faAngleDown, faAngleUp, faCircle, faCheckCircle, faMoneyCheckAlt, faWifi);
    library.addIcons(faCalendarAlt, faCalendarPlus, faCompass, faClock, faEnvelope, faEdit, faClone, faHandshake, faBuilding);
    library.addIcons(faPaypal, faStripe, faIdeal, faApplePay);
  }
}
