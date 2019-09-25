import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { HttpClientModule, HttpClientXsrfModule, HttpClient } from '@angular/common/http';

import {FaIconLibrary, FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {
  faInfoCircle, faGift, faTicketAlt, faCheck, faAddressCard, faFileAlt, faThumbsUp, faMoneyBill, faDownload, faSearchPlus,
  faExchangeAlt, faExclamationTriangle, faCreditCard, faCog, faEraser, faTimes, faFileInvoice
} from '@fortawesome/free-solid-svg-icons';
import { faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock, faEnvelope, faEdit, faClone, faHandshake } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { NgbTooltipModule, NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';

import { BookingComponent } from './reservation/booking/booking.component';
import { OverviewComponent } from './reservation/overview/overview.component';
import { SuccessComponent } from './reservation/success/success.component';
import { ReservationComponent } from './reservation/reservation.component';
import { EventHeaderComponent } from './event-header/event-header.component';
import { StepperComponent } from './stepper/stepper.component';
import { AdditionalFieldComponent } from './additional-field/additional-field.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { EventSummaryComponent } from './event-summary/event-summary.component';
import { TicketFormComponent } from './reservation/ticket-form/ticket-form.component';
import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { CountdownComponent } from './countdown/countdown.component';
import { BannerCheckComponent } from './banner-check/banner-check.component';
import { OfflinePaymentComponent } from './reservation/offline-payment/offline-payment.component';
import { OfflinePaymentProxyComponent } from './payment/offline-payment-proxy/offline-payment-proxy.component';
import { OnsitePaymentProxyComponent } from './payment/onsite-payment-proxy/onsite-payment-proxy.component';
import { PaypalPaymentProxyComponent } from './payment/paypal-payment-proxy/paypal-payment-proxy.component';
import { StripePaymentProxyComponent } from './payment/stripe-payment-proxy/stripe-payment-proxy.component';
import { ProcessingPaymentComponent } from './reservation/processing-payment/processing-payment.component';
import { SummaryTableComponent } from './reservation/summary-table/summary-table.component';
import { InvoiceFormComponent } from './reservation/invoice-form/invoice-form.component';
import { InvalidFeedbackDirective } from './shared/invalid-feedback.directive';
import { AdditionalServiceComponent } from './additional-service/additional-service.component';
import { RecaptchaComponent } from './recaptcha/recaptcha.component';
import { CustomLoader } from './shared/i18n.service';
import { NotFoundComponent } from './reservation/not-found/not-found.component';
import {PriceTagComponent} from './price-tag/price-tag.component';
import {TicketQuantitySelectorComponent} from "./ticket-quantity-selector/ticket-quantity-selector.component";
import {ItemSalePeriodComponent} from "./category-sale-period/item-sale-period.component";
import {ItemCardComponent} from "./item-card/item-card.component";
import {AdditionalServiceQuantitySelectorComponent} from "./additional-service-quantity-selector/additional-service-quantity-selector.component";
import { ReservationExpiredComponent } from './reservation/expired-notification/reservation-expired.component';
import { NgbModalBackdrop } from '@ng-bootstrap/ng-bootstrap/modal/modal-backdrop';



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new CustomLoader(http);
}

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventDisplayComponent,
    BookingComponent,
    OverviewComponent,
    SuccessComponent,
    ReservationComponent,
    EventHeaderComponent,
    StepperComponent,
    AdditionalFieldComponent,
    ViewTicketComponent,
    EventSummaryComponent,
    TicketFormComponent,
    LanguageSelectorComponent,
    CountdownComponent,
    BannerCheckComponent,
    OfflinePaymentComponent,
    OfflinePaymentProxyComponent,
    OnsitePaymentProxyComponent,
    PaypalPaymentProxyComponent,
    StripePaymentProxyComponent,
    ProcessingPaymentComponent,
    SummaryTableComponent,
    InvoiceFormComponent,
    InvalidFeedbackDirective,
    AdditionalServiceComponent,
    RecaptchaComponent,
    PriceTagComponent,
    NotFoundComponent,
    TicketQuantitySelectorComponent,
    ItemSalePeriodComponent,
    ItemCardComponent,
    AdditionalServiceQuantitySelectorComponent,
    ReservationExpiredComponent
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
    NgbModalModule
  ],
  providers: [],
  bootstrap: [AppComponent],
  entryComponents: [ReservationExpiredComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faInfoCircle, faGift, faTicketAlt, faCheck, faAddressCard, faFileAlt, faThumbsUp, faMoneyBill,
      faDownload, faSearchPlus, faExchangeAlt, faExclamationTriangle, faCreditCard, faCog, faEraser, faTimes, faFileInvoice);
    library.addIcons(faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock, faEnvelope, faEdit, faClone, faHandshake);
    library.addIcons(faGoogle, faPaypal, faStripe);
  }
}
