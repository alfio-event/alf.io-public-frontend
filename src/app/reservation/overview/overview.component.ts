import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { ReservationService } from '../../shared/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event, PaymentMethod, PaymentProxy, PaymentProxyWithParameters } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { PaymentProvider, SimplePaymentProvider, PaymentResult } from 'src/app/payment/payment-provider';
import { handleServerSideValidationError } from 'src/app/shared/validation-helper';
import { I18nService } from 'src/app/shared/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from 'src/app/shared/analytics.service';
import { ErrorDescriptor, ValidatedResponse } from 'src/app/model/validated-response';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  reservationInfo: ReservationInfo;
  overviewForm: FormGroup;
  globalErrors: ErrorDescriptor[];

  eventShortName: string;
  reservationId: string;
  event: Event;
  expired: boolean;

  submitting: boolean;

  selectedPaymentProvider: PaymentProvider;

  activePaymentMethods: {[key in PaymentMethod]?: PaymentProxyWithParameters};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private translate: TranslateService,
    private analytics: AnalyticsService) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.event = ev;

        this.activePaymentMethods = this.event.activePaymentMethods;

        this.i18nService.setPageTitle('reservation-page.header.title', ev.displayName);

        this.loadReservation(ev);

        this.analytics.pageView(ev.analyticsConfiguration);
      });
    });
  }


  loadReservation(ev: Event) {
    this.reservationService.getReservationInfo(this.eventShortName, this.reservationId).subscribe(resInfo => {
      this.reservationInfo = resInfo;

      let paymentProxy: PaymentProxy = null;
      let selectedPaymentMethod: PaymentMethod = null;

      if (!resInfo.orderSummary.free && this.paymentMethodsCount() === 1) {
        selectedPaymentMethod = this.getSinglePaymentMethod();
        paymentProxy = ev.activePaymentMethods[selectedPaymentMethod].paymentProxy;
      }

      if (resInfo.orderSummary.free) {
        selectedPaymentMethod = 'NONE';
        this.selectedPaymentProvider = new SimplePaymentProvider();
      }

      //
      if (this.reservationInfo.tokenAcquired) {
        paymentProxy = this.reservationInfo.paymentProxy;
        selectedPaymentMethod = this.getPaymentMethodMatchingProxy(paymentProxy);

        // we override and keep only the one selected
        const paymentProxyAndParam = this.event.activePaymentMethods[selectedPaymentMethod];
        this.activePaymentMethods = {};
        this.activePaymentMethods[selectedPaymentMethod] = paymentProxyAndParam;
        //
      } else {
        this.activePaymentMethods = this.event.activePaymentMethods;
      }
      //

      this.overviewForm = this.formBuilder.group({
        termAndConditionsAccepted: null,
        privacyPolicyAccepted: null,
        selectedPaymentMethod: selectedPaymentMethod, // <- note: not used by the backend
        paymentMethod: paymentProxy, // <- name mismatch for legacy reasons
        gatewayToken: null,
        captcha: null
      });

      // we synchronize the selectedPaymentMethod with the corresponding paymentMethod (which is a payment proxy)
      this.overviewForm.get('selectedPaymentMethod').valueChanges.subscribe(v => {
        this.overviewForm.get('paymentMethod').setValue(ev.activePaymentMethods[v as PaymentMethod].paymentProxy);
      });
    });
  }

  paymentMethodsCount(): number {
    return Object.keys(this.activePaymentMethods).length;
  }

  private getPaymentMethodMatchingProxy(paymentProxy: PaymentProxy): PaymentMethod | null {
    const keys: PaymentMethod[] = Object.keys(this.activePaymentMethods) as PaymentMethod[];
    for (const idx in keys) {
      if (this.activePaymentMethods[keys[idx]].paymentProxy === paymentProxy) {
        return keys[idx];
      }
    }
    return null;
  }

  getSinglePaymentMethod(): PaymentMethod {
    return (Object.keys(this.activePaymentMethods) as PaymentMethod[])[0];
  }

  back(requestInvoice?: boolean): void {
    const extras: NavigationExtras = {};
    if (requestInvoice != null) {
      extras.queryParams = {
        'requestInvoice': requestInvoice
      };
    }
    if (this.expired) {
      this.reservationService.cancelPendingReservation(this.eventShortName, this.reservationId).subscribe(res => {
        this.router.navigate(['event', this.eventShortName]);
      });
    } else {
      this.reservationService.backToBooking(this.eventShortName, this.reservationId).subscribe(res => {
        this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'book'], extras);
      });
    }
  }

  confirm() {

    if (!this.overviewForm.valid || this.selectedPaymentProvider == null) {
      return; // prevent accidental submissions
    }

    this.submitting = true;
    this.registerUnloadHook();
    this.selectedPaymentProvider.pay().subscribe(paymentResult => {
      if (paymentResult.success) {
        this.overviewForm.get('gatewayToken').setValue(paymentResult.gatewayToken);
        const overviewFormValue = this.overviewForm.value;
        this.reservationService.confirmOverview(this.eventShortName, this.reservationId, overviewFormValue, this.translate.currentLang).subscribe(res => {
          if (res.success) {
            this.unregisterHook();
            if (res.value.redirect) { // handle the case of redirects (e.g. paypal, stripe)
              window.location.href = res.value.redirectUrl;
            } else {
              this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success']);
            }
          } else {
            this.submitting = false;
            this.unregisterHook();
            this.globalErrors = handleServerSideValidationError(res, this.overviewForm);
          }
        }, (err) => {
          this.submitting = false;
          this.unregisterHook();
          this.globalErrors = handleServerSideValidationError(err, this.overviewForm);
        });
      } else {
        console.log('paymentResult is not success (may be cancelled)');
        this.unregisterHook();
        this.submitting = false;
      }
    }, (err) => {
      this.submitting = false;
      this.unregisterHook();
      this.notifyPaymentError(err);
    });
  }

  private registerUnloadHook(): void {
    console.log('warn on page reload: on');
    // source: https://developer.mozilla.org/en-US/docs/Web/API/WindowEventHandlers/onbeforeunload
    window.onbeforeunload = function (e: BeforeUnloadEvent) {
        // Cancel the event
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
    };
  }

  private unregisterHook(): void {
    console.log('warn on page reload: off');
    window.onbeforeunload = null;
  }

  private notifyPaymentError(response: any): void {
    const errorDescriptor = new ErrorDescriptor();
    errorDescriptor.fieldName = '';
    if (response != null && response instanceof PaymentResult) {
      errorDescriptor.code = 'error.STEP_2_PAYMENT_PROCESSING_ERROR';
      errorDescriptor.arguments = {
        '0': (<PaymentResult>response).reason
      };
    } else {
      errorDescriptor.code = 'error.STEP_2_PAYMENT_REQUEST_CREATION';
    }
    const validatedResponse = new ValidatedResponse();
    validatedResponse.errorCount = 1;
    validatedResponse.validationErrors = [errorDescriptor];
    this.globalErrors = handleServerSideValidationError(validatedResponse, this.overviewForm);
  }

  get acceptedPrivacyAndTermAndConditions(): boolean {
    if (this.event.privacyPolicyUrl) {
      return this.overviewForm.value.privacyPolicyAccepted && this.overviewForm.value.termAndConditionsAccepted;
    } else {
      return this.overviewForm.value.termAndConditionsAccepted;
    }
  }

  handleExpired(expired: boolean) {
    this.expired = expired;
  }

  registerCurrentPaymentProvider(paymentProvider: PaymentProvider) {
    this.selectedPaymentProvider = paymentProvider;
  }

  clearToken(): void {
    this.reservationService.removePaymentToken(this.eventShortName, this.reservationId).subscribe(r => {
      this.loadReservation(this.event);
    });
  }

  handleRecaptchaResponse(recaptchaValue: string) {
    this.overviewForm.get('captcha').setValue(recaptchaValue);
  }

  get enabledItalyEInvoicing(): boolean {
    return this.event.invoicingConfiguration.enabledItalyEInvoicing &&
      this.reservationInfo.billingDetails.invoicingAdditionalInfo.italianEInvoicing != null;
  }

  get hasTaxId(): boolean {
    return this.reservationInfo.invoiceRequested && this.reservationInfo.billingDetails.taxId != null;
  }

  get italyEInvoicingReference(): string {
    const itEInvoicing = this.reservationInfo.billingDetails.invoicingAdditionalInfo.italianEInvoicing;
    if (!this.enabledItalyEInvoicing || itEInvoicing == null) {
      return '';
    }
    return itEInvoicing.reference;
  }

  get italyEInvoicingSelectedAddresseeKey(): string {
    if (!this.enabledItalyEInvoicing) {
      return '';
    }
    const referenceType = this.reservationInfo.billingDetails.invoicingAdditionalInfo.italianEInvoicing.referenceType;
    return referenceType === 'ADDRESSEE_CODE' ? 'invoice-fields.addressee-code' : 'invoice-fields.pec';
  }

  get italyEInvoicingFiscalCode(): string {
    const itEInvoicing = this.reservationInfo.billingDetails.invoicingAdditionalInfo.italianEInvoicing;
    if (!this.enabledItalyEInvoicing || itEInvoicing == null) {
      return '';
    }
    return itEInvoicing.fiscalCode;
  }
}
