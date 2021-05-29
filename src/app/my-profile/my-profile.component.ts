import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';
import {PurchaseContextWithReservation, ReservationHeader, User} from '../model/user';
import {TranslateService} from '@ngx-translate/core';
import {I18nService} from '../shared/i18n.service';
import {InvoicingConfiguration, Language} from '../model/event';
import {IconProp} from '@fortawesome/fontawesome-svg-core';
import {zip} from 'rxjs';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {BookingComponent} from '../reservation/booking/booking.component';
import {BillingDetails, EMPTY_BILLING_DETAILS} from '../model/reservation-info';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html'
})
export class MyProfileComponent implements OnInit {

  user?: User;
  languages: Language[];
  userForm: FormGroup;
  invoicingConfiguration: InvoicingConfiguration;

  constructor(private userService: UserService,
              private translateService: TranslateService,
              private i18nService: I18nService,
              private formBuilder: FormBuilder) {
    this.invoicingConfiguration = {
      euVatCheckingEnabled: false,
      customerReferenceEnabled: false,
      enabledItalyEInvoicing: true,
      invoiceAllowed: true,
      vatNumberStrictlyRequired: false,
      onlyInvoice: false,
      userCanDownloadReceiptOrInvoice: false
    };
  }

  ngOnInit(): void {
    zip(this.userService.getUserIdentity(), this.i18nService.getAvailableLanguages())
      .subscribe(([user, languages]) => {
        this.languages = languages;
        this.i18nService.setPageTitle('user.menu.my-profile', null);
        const userBillingDetails = user.profile?.billingDetails || EMPTY_BILLING_DETAILS;
        this.userForm = this.formBuilder.group({
          firstName: this.formBuilder.control(user.firstName, Validators.required),
          lastName: this.formBuilder.control(user.lastName, Validators.required),
          billingAddressCompany: userBillingDetails.companyName,
          billingAddressLine1: userBillingDetails.addressLine1,
          billingAddressLine2: userBillingDetails.addressLine2,
          billingAddressZip: userBillingDetails.zip,
          billingAddressCity: userBillingDetails.city,
          billingAddressState: userBillingDetails.state,
          vatCountryCode: userBillingDetails.country,
          vatNr: userBillingDetails.taxId,
          italyEInvoicingFiscalCode: BookingComponent.optionalGet(userBillingDetails, (i) => i.fiscalCode),
          italyEInvoicingReferenceType: BookingComponent.optionalGet(userBillingDetails, (i) => i.referenceType),
          italyEInvoicingReferenceAddresseeCode: BookingComponent.optionalGet(userBillingDetails, (i) => i.addresseeCode),
          italyEInvoicingReferencePEC: BookingComponent.optionalGet(userBillingDetails, (i) => i.pec),
          italyEInvoicingSplitPayment: BookingComponent.optionalGet(userBillingDetails, (i) => i.splitPayment),
        });
      });
  }


}
