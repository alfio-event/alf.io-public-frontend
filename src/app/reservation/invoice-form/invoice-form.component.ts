import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Event } from 'src/app/model/event';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n.service';
import { zip } from 'rxjs';
import { LocalizedCountry } from 'src/app/model/localized-country';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {

  @Input()
  form: FormGroup;

  @Input()
  event: Event;

  countries: LocalizedCountry[];
  euCountries: LocalizedCountry[];

  constructor(private translate: TranslateService, private i18nService: I18nService) { }

  ngOnInit(): void {
    this.getCountries(this.translate.currentLang);
    this.translate.onLangChange.subscribe(change => {
      this.getCountries(this.translate.currentLang);
    });
  }


  getCountries(currentLang: string): void {
    zip(this.i18nService.getVatCountries(currentLang), this.i18nService.getEUVatCountries(currentLang)).subscribe( ([countries, euCountries]) => {
      this.countries = countries;
      this.euCountries = euCountries;
    });
  }

  get euVatCheckingEnabled(): boolean {
    return this.event.invoicingConfiguration.euVatCheckingEnabled;
  }

  get customerReferenceEnabled(): boolean {
    return this.event.invoicingConfiguration.customerReferenceEnabled;
  }

  get invoiceBusiness(): boolean {
    return this.form.value.addCompanyBillingDetails
  }

}
