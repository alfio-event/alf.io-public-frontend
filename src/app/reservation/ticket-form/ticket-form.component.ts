import {Component, Input, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Ticket} from 'src/app/model/ticket';
import {PurchaseContext} from 'src/app/model/purchase-context';
import {ReservationMetadata} from '../../model/reservation-info';

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
  purchaseContext: PurchaseContext;

  @Input()
  reservationMetadata: ReservationMetadata;

  public ngOnInit(): void {
    if (this.form && this.purchaseContext && this.purchaseContext.contentLanguages && this.purchaseContext.contentLanguages.length === 1) {
      this.form.get('userLanguage').setValue(this.purchaseContext.contentLanguages[0].locale);
    }
  }

  getAdditional(form: FormGroup) {
    return form.get('additional') as FormGroup;
  }

  get emailEditForbidden(): boolean {
    return this.ticket.locked || (this.reservationMetadata?.lockEmailEdit && this.ticket.email != null);
  }
}
