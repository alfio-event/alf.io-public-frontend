import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AdditionalField } from '../model/ticket';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-additional-field',
  templateUrl: './additional-field.component.html'
})
export class AdditionalFieldComponent {

  @Input()
  field: AdditionalField;

  @Input()
  form: FormGroup;

  @Input()
  ticketUUID: string;

  constructor(private translate: TranslateService) { }

  public get labelValue(): string {
    if (this.field && this.field.description && this.field.description[this.translate.currentLang]) {
      return this.field.description[this.translate.currentLang].label;
    } else {
      return "";
    }
  }
}
