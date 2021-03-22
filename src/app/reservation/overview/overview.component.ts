import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationExtras, Router} from '@angular/router';
import { ReservationService } from '../../shared/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event, PaymentMethod, PaymentProxy, PaymentProxyWithParameters } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { PaymentProvider, SimplePaymentProvider, PaymentResult, PaymentStatusNotification } from 'src/app/payment/payment-provider';
import { handleServerSideValidationError } from 'src/app/shared/validation-helper';
import { I18nService } from 'src/app/shared/i18n.service';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from 'src/app/shared/analytics.service';
import { ErrorDescriptor, ValidatedResponse } from 'src/app/model/validated-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationExpiredComponent } from '../expired-notification/reservation-expired.component';

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
  paymentStatusNotification: PaymentStatusNotification;
  private forceCheckInProgress = false;

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
    private analytics: AnalyticsService,
    private modalService: NgbModal) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.event = ev;

        this.i18nService.setPageTitle('reservation-page.header.title', ev.displayName);

        this.loadReservation(ev);

        this.analytics.pageView(ev.analyticsConfiguration);
      });
    });
  }


  loadReservation(ev: Event) {
    this.reservationService.getReservationInfo(this.eventShortName, this.reservationId).subscribe(resInfo => {
      this.reservationInfo = resInfo;

      this.activePaymentMethods = this.reservationInfo.activePaymentMethods;
      let currentPaymentProxy: PaymentProxy = null;
      let selectedPaymentMethod: PaymentMethod = null;

      if (!resInfo.orderSummary.free && this.paymentMethodsCount() === 1) {
        selectedPaymentMethod = this.getSinglePaymentMethod();
        currentPaymentProxy = this.reservationInfo.activePaymentMethods[selectedPaymentMethod].paymentProxy;
      }

      if (resInfo.orderSummary.free) {
        selectedPaymentMethod = 'NONE';
        this.selectedPaymentProvider = new SimplePaymentProvider();
      }

      //
      if (this.reservationInfo.tokenAcquired) {
        currentPaymentProxy = this.reservationInfo.paymentProxy;
        selectedPaymentMethod = this.getPaymentMethodMatchingProxy(currentPaymentProxy);

        // we override and keep only the one selected
        const paymentProxyAndParam = this.reservationInfo.activePaymentMethods[selectedPaymentMethod];
        this.activePaymentMethods = {};
        this.activePaymentMethods[selectedPaymentMethod] = paymentProxyAndParam;
        //
      } else {
        this.activePaymentMethods = this.reservationInfo.activePaymentMethods;
      }
      //

      this.overviewForm = this.formBuilder.group({
        termAndConditionsAccepted: this.reservationInfo.tokenAcquired,
        privacyPolicyAccepted: this.reservationInfo.tokenAcquired,
        selectedPaymentMethod: selectedPaymentMethod,
        paymentProxy: currentPaymentProxy,
        gatewayToken: null,
        captcha: null
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
    this.selectedPaymentProvider.statusNotifications().subscribe(notification => {
      if (!this.forceCheckInProgress) {
        this.paymentStatusNotification = notification;
      }
    });
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
        if (paymentResult != null && paymentResult.reservationChanged) {
          console.log('reservation status is changed. Trying to reload it...');
          // reload reservation, try to go to /success
          this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success']);
        } else {
          this.submitting = false;
        }
      }
    }, (err) => {
      this.submitting = false;
      this.unregisterHook();
      this.notifyPaymentError(err);
    });
  }

  forceCheck(): void {
    this.paymentStatusNotification = null;
    this.forceCheckInProgress = true;
    this.reservationService.forcePaymentStatusCheck(this.eventShortName, this.reservationId).subscribe(res => {
      if (res.success) {
        console.log('reservation has been confirmed. Waiting for the PaymentProvider to aknowledge it...');
      }
    }, err => console.log('error while force-checking', err));
  }

  private registerUnloadHook(): void {
    window.addEventListener('beforeunload', onUnLoadListener);
    console.log('warn on page reload: on');
  }

  private unregisterHook(): void {
    window.removeEventListener('beforeunload', onUnLoadListener);
    console.log('warn on page reload: off');
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
    setTimeout(() => {
      if (!this.expired) {
        this.expired = expired;
        this.modalService.open(ReservationExpiredComponent, {centered: true, backdrop: 'static'})
            .result.then(() => this.router.navigate(['event', this.eventShortName], {replaceUrl: true}));
      }
    });
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
    return this.reservationInfo.invoiceRequested
      && !this.reservationInfo.skipVatNr
      && this.reservationInfo.billingDetails.taxId != null;
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

  get paymentMethodDeferred(): boolean {
    if (this.reservationInfo.tokenAcquired) {
      return false;
    }
    return this.selectedPaymentProvider != null && this.selectedPaymentProvider.paymentMethodDeferred;
  }

  get taxIdMessageKey(): string {
    if (this.reservationInfo.billingDetails.country === 'IT') {
      return 'invoice-fields.fiscalCode';
    }
    return 'invoice-fields.tax-id';
  }
}

function onUnLoadListener(e: BeforeUnloadEvent) {
  // Cancel the event
  e.preventDefault();
  // Chrome requires returnValue to be set
  e.returnValue = '';
}
