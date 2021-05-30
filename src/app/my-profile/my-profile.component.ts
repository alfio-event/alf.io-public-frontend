import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';
import {User} from '../model/user';
import {TranslateService} from '@ngx-translate/core';
import {I18nService} from '../shared/i18n.service';
import {InvoicingConfiguration, Language} from '../model/event';
import {zip} from 'rxjs';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BookingComponent} from '../reservation/booking/booking.component';
import {handleServerSideValidationError} from '../shared/validation-helper';
import {ErrorDescriptor} from '../model/validated-response';
import {InfoService} from '../shared/info.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html'
})
export class MyProfileComponent implements OnInit {

  user?: User;
  languages: Language[];
  userForm?: FormGroup;
  invoicingConfiguration?: InvoicingConfiguration;
  globalErrors: ErrorDescriptor[];

  constructor(private userService: UserService,
              private translateService: TranslateService,
              private i18nService: I18nService,
              private formBuilder: FormBuilder,
              private infoService: InfoService) {
    this.userForm = this.formBuilder.group({
      firstName: this.formBuilder.control(null, Validators.required),
      lastName: this.formBuilder.control(null, Validators.required),
      addCompanyBillingDetails: this.formBuilder.control(false),
      billingAddressCompany: this.formBuilder.control(null),
      billingAddressLine1: this.formBuilder.control(null),
      billingAddressLine2: this.formBuilder.control(null),
      billingAddressZip: this.formBuilder.control(null),
      billingAddressCity: this.formBuilder.control(null),
      billingAddressState: this.formBuilder.control(null),
      vatCountryCode: this.formBuilder.control(null),
      skipVatNr: this.formBuilder.control(false),
      vatNr: this.formBuilder.control(null),
      italyEInvoicingFiscalCode: this.formBuilder.control(null),
      italyEInvoicingReferenceType: this.formBuilder.control(null),
      italyEInvoicingReferenceAddresseeCode: this.formBuilder.control(null),
      italyEInvoicingReferencePEC: this.formBuilder.control(null),
      italyEInvoicingSplitPayment: this.formBuilder.control(null),
    });
  }

  ngOnInit(): void {
    zip(this.userService.getUserIdentity(), this.i18nService.getAvailableLanguages(), this.infoService.getInfo())
      .subscribe(([user, languages, info]) => {
        this.languages = languages;
        this.i18nService.setPageTitle('user.menu.my-profile', null);
        this.invoicingConfiguration = info.invoicingConfiguration;
        let values: {[p: string]: any} = {
          firstName: user.firstName,
          lastName: user.lastName
        };
        const userBillingDetails = user.profile?.billingDetails;
        if (userBillingDetails != null) {
          values = {
            ...values,
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
            italyEInvoicingSplitPayment: BookingComponent.optionalGet(userBillingDetails, (i) => i.splitPayment)
          };
        }
        this.userForm.patchValue(values);
      });
  }


  save(): void {
    if (this.userForm.valid) {
      this.userService.updateUser(this.userForm.value)
        .subscribe(res => {
          if (res.success) {
            this.user = res.value;
          } else {
            handleServerSideValidationError(res.validationErrors, this.userForm);
          }
        }, err => this.globalErrors = handleServerSideValidationError(err, this.userForm));
    }
  }
}
