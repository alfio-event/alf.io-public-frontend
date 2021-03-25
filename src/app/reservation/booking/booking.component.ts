import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from 'src/app/shared/ticket.service';
import { BillingDetails, ItalianEInvoicing, ReservationInfo, TicketsByTicketCategory } from 'src/app/model/reservation-info';
import { EventService } from 'src/app/shared/event.service';
import { Event } from 'src/app/model/event';
import { Subject, zip } from 'rxjs';
import { handleServerSideValidationError } from 'src/app/shared/validation-helper';
import { I18nService } from 'src/app/shared/i18n.service';
import { Ticket } from 'src/app/model/ticket';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from 'src/app/shared/analytics.service';
import { ErrorDescriptor } from 'src/app/model/validated-response';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReservationExpiredComponent } from '../expired-notification/reservation-expired.component';
import { CancelReservationComponent } from '../cancel-reservation/cancel-reservation.component';
import {WarningModalComponent} from '../../shared/warning-modal/warning-modal.component';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit, AfterViewInit {

  reservationInfo: ReservationInfo;
  event: Event;
  contactAndTicketsForm: FormGroup;
  eventShortName: string;
  reservationId: string;
  expired: boolean;
  globalErrors: ErrorDescriptor[];
  @ViewChild('invoiceAnchor')
  private invoiceElement: ElementRef<HTMLAnchorElement>;
  private doScroll = new Subject<boolean>();

  ticketCounts: number;

  enableAttendeeAutocomplete: boolean;

  private static optionalGet<T>(billingDetails: BillingDetails, consumer: (b: ItalianEInvoicing) => T): T | null {
    const italianEInvoicing = billingDetails.invoicingAdditionalInfo.italianEInvoicing;
    if (italianEInvoicing != null) {
      return consumer(italianEInvoicing);
    }
    return null;
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private ticketService: TicketService,
    private eventService: EventService,
    private formBuilder: FormBuilder,
    private i18nService: I18nService,
    private translate: TranslateService,
    private analytics: AnalyticsService,
    private modalService: NgbModal) { }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      zip(
        this.eventService.getEvent(this.eventShortName),
        this.reservationService.getReservationInfo(this.eventShortName, this.reservationId)
      ).subscribe(([ev, reservationInfo]) => {
        this.event = ev;
        this.reservationInfo = reservationInfo;

        this.i18nService.setPageTitle('reservation-page.header.title', ev.displayName);

        const invoiceRequested = ev.invoicingConfiguration.onlyInvoice ? true : reservationInfo.invoiceRequested;

        //
        this.ticketCounts = 0;
        this.reservationInfo.ticketsByCategory.forEach(t => {
          this.ticketCounts += t.tickets.length;
        });


        // auto complete (copy by default first/lastname + email to ticket) is enabled only if we have only
        // one ticket
        if (this.ticketCounts === 1 && this.event.assignmentConfiguration.enableAttendeeAutocomplete) {
          this.enableAttendeeAutocomplete = true;
        }
        //

        //

        const billingDetails = this.reservationInfo.billingDetails;

        this.contactAndTicketsForm = this.formBuilder.group({
          firstName: this.formBuilder.control(this.reservationInfo.firstName, [Validators.required, Validators.maxLength(255)]),
          lastName: this.formBuilder.control(this.reservationInfo.lastName, [Validators.required, Validators.maxLength(255)]),
          email: this.formBuilder.control(this.reservationInfo.email, [Validators.required, Validators.maxLength(255)]),
          tickets: this.buildTicketsFormGroup(this.reservationInfo.ticketsByCategory),
          invoiceRequested: invoiceRequested,
          addCompanyBillingDetails: this.reservationInfo.addCompanyBillingDetails,
          billingAddressCompany: billingDetails.companyName,
          billingAddressLine1: billingDetails.addressLine1,
          billingAddressLine2: billingDetails.addressLine2,
          billingAddressZip: billingDetails.zip,
          billingAddressCity: billingDetails.city,
          billingAddressState: billingDetails.state,
          vatCountryCode: billingDetails.country,
          customerReference: this.reservationInfo.customerReference,
          vatNr: billingDetails.taxId,
          skipVatNr: this.reservationInfo.skipVatNr,
          italyEInvoicingFiscalCode: BookingComponent.optionalGet(billingDetails, (i) => i.fiscalCode),
          italyEInvoicingReferenceType: BookingComponent.optionalGet(billingDetails, (i) => i.referenceType),
          italyEInvoicingReferenceAddresseeCode: BookingComponent.optionalGet(billingDetails, (i) => i.addresseeCode),
          italyEInvoicingReferencePEC: BookingComponent.optionalGet(billingDetails, (i) => i.pec),
          italyEInvoicingSplitPayment: BookingComponent.optionalGet(billingDetails, (i) => i.splitPayment),
          postponeAssignment: false // <- TODO: check if we save it somewhere in the db...
        });

        setTimeout(() => this.doScroll.next(this.invoiceElement != null));

        this.analytics.pageView(ev.analyticsConfiguration);
      });
    });
  }

  ngAfterViewInit(): void {
    zip(this.route.queryParams, this.doScroll.asObservable())
      .subscribe(results => {
        const requestInvoice: boolean = !!results[0].requestInvoice;
        if (requestInvoice && results[1]) {
          this.contactAndTicketsForm.get('invoiceRequested').setValue(true);
          this.invoiceElement.nativeElement.scrollIntoView(true);
        }
      });
  }

  private buildTicketsFormGroup(ticketsByCategory: TicketsByTicketCategory[]): FormGroup {
    const tickets = {};
    ticketsByCategory.forEach(t => {
      t.tickets.forEach((ticket) => {
        tickets[ticket.uuid] = this.ticketService.buildFormGroupForTicket(ticket);
      });
    });
    return this.formBuilder.group(tickets);
  }

  private removeUnnecessaryFields(): void {
    // check invoice data, remove company data if private invoice has been chosen
    if (this.contactAndTicketsForm.get('invoiceRequested').value && !this.contactAndTicketsForm.get('addCompanyBillingDetails').value) {
      ['billingAddressCompany', 'vatNr', 'skipVatNr'].forEach(n => this.contactAndTicketsForm.get(n).setValue(null));
    }
  }

  submitForm(): void {
    this.removeUnnecessaryFields();
    this.validateToOverview(false);
  }

  private validateToOverview(ignoreWarnings: boolean): void {
    this.reservationService.validateToOverview(this.eventShortName, this.reservationId, this.contactAndTicketsForm.value, this.translate.currentLang, ignoreWarnings)
      .subscribe(res => {
        if (res.success && (!res.warnings || res.warnings.length === 0 || ignoreWarnings)) {
          this.proceedToOverview();
        } else if (res.success) {
          // display warnings
          const modalRef = this.modalService.open(WarningModalComponent, {centered: true, backdrop: 'static'});
          modalRef.componentInstance.message = res.warnings[0];
          modalRef.result.then(() => this.validateToOverview(true));
        }
      }, (err) => {
        this.globalErrors = handleServerSideValidationError(err, this.contactAndTicketsForm);
      });
  }

  private proceedToOverview(): Promise<boolean> {
    return this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'overview']);
  }

  cancelPendingReservation() {
    this.modalService.open(CancelReservationComponent, {centered: true}).result.then(res => {
      if (res === 'yes') {
        this.reservationService.cancelPendingReservation(this.eventShortName, this.reservationId).subscribe(() => {
          this.router.navigate(['event', this.eventShortName], {replaceUrl: true});
        });
      }
    }, () => {});
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

  handleInvoiceRequestedChange() {
    // set addCompanyBillingDetails to false if it's null
    if (this.contactAndTicketsForm.value.addCompanyBillingDetails === null) {
      this.contactAndTicketsForm.get('addCompanyBillingDetails').setValue(false);
    }
  }

  handleAutocomplete(fieldName: string, value: string) {
    if (this.enableAttendeeAutocomplete) {
      const ticketUUID = Object.keys(this.contactAndTicketsForm.get('tickets').value)[0];
      const targetControl = this.contactAndTicketsForm.get(`tickets.${ticketUUID}.${fieldName}`);
      if (targetControl.pristine && (targetControl.value == null || targetControl.value === '')) {
        targetControl.setValue(value);
      }
    }
  }

  getTicketForm(ticket: Ticket): FormGroup {
    return this.contactAndTicketsForm.get('tickets.' + ticket.uuid) as FormGroup;
  }

  copyContactInfoTo(ticket: Ticket) {
    ['firstName', 'lastName', 'email'].forEach(field => {
      const val = this.contactAndTicketsForm.get(field).value;
      this.contactAndTicketsForm.get(`tickets.${ticket.uuid}.${field}`).setValue(val);
    });
  }

}
