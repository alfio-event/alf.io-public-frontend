import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Event } from 'src/app/model/event';
import { TranslateService } from '@ngx-translate/core';
import { I18nService } from 'src/app/shared/i18n.service';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {

  @Input()
  form: FormGroup;

  @Input()
  event: Event;

  constructor(private translate: TranslateService, private i18nService: I18nService) { }

  ngOnInit() {
  }

}
