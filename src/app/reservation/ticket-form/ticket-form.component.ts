import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Ticket } from 'src/app/model/ticket';
import { PurchaseContext } from 'src/app/model/purchase-context';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html'
})
export class TicketFormComponent implements OnInit {

  @Input()
  form: FormGroup;

  @Input()
  ticket: Ticket;

  @Input()
  event: PurchaseContext;

  constructor() { }

  public ngOnInit(): void {
    if (this.form && this.event && this.event.contentLanguages && this.event.contentLanguages.length === 1) {
      this.form.get('userLanguage').setValue(this.event.contentLanguages[0].locale);
    }
  }

  getAdditional(form: FormGroup) {
    return form.get('additional') as FormGroup;
  }
}
