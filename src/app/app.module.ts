import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { HttpClientModule, HttpClientXsrfModule, HttpClient }    from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle, faGift, faTicketAlt, faCheck, faAddressCard, faFileAlt, faThumbsUp, faMoneyBill, faDownload, faSearchPlus, faExchangeAlt, faExclamationTriangle, faCreditCard, faCog, faEraser, faTimes } from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock, faEnvelope, faEdit, faClone, faHandshake } from '@fortawesome/free-regular-svg-icons';
import { faGoogle, faPaypal, faStripe } from '@fortawesome/free-brands-svg-icons'
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

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



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/api/v2/public/i18n/bundle/', '');
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
    RecaptchaComponent
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
          useClass: CustomLoader,
          /*useFactory: HttpLoaderFactory,
          deps: [HttpClient]*/
      }
    }),
    NgbTooltipModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    library.add(faInfoCircle, faGift, faTicketAlt, faCheck, faAddressCard, faFileAlt, faThumbsUp, faMoneyBill, faDownload, faSearchPlus, faExchangeAlt, faExclamationTriangle, faCreditCard, faCog, faEraser, faTimes);
    library.add(faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock, faEnvelope, faEdit, faClone, faHandshake);
    library.add(faGoogle, faPaypal, faStripe);
  }
}
