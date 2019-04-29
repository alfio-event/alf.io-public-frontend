import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdditionalField } from '../model/ticket';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from '../shared/i18n.service';

@Component({
  selector: 'app-additional-field',
  templateUrl: './additional-field.component.html'
})
export class AdditionalFieldComponent implements OnInit {

  @Input()
  field: AdditionalField;

  @Input()
  form: FormGroup;

  @Input()
  ticketUUID: string;

  countries: any;

  constructor(private translate: TranslateService, private i18nService: I18nService) { }

  public ngOnInit(): void {
    if (this.field.countryField) {
      this.getCountries();
      this.translate.onLangChange.subscribe(change => {
        this.getCountries();
      })
    }
  }

  public get labelValue(): string {
    if (this.field && this.field.description && this.field.description[this.translate.currentLang]) {
      return this.field.description[this.translate.currentLang].label;
    } else {
      return "";
    }
  }

  getCountries(): void {
    this.i18nService.getCountries(this.translate.currentLang).subscribe(countries => {
      this.countries = countries;
    });
  }
}
