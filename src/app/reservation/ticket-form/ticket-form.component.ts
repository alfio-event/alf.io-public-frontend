import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormGroup} from '@angular/forms';
import {AdditionalField, MoveAdditionalServiceRequest, Ticket, TicketIdentifier} from 'src/app/model/ticket';
import {PurchaseContext} from 'src/app/model/purchase-context';
import {AdditionalServiceWithData, ReservationMetadata} from '../../model/reservation-info';
import {I18nService} from '../../shared/i18n.service';

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

  @Input()
  additionalServicesForm: FormArray | null;

  @Input()
  additionalServices: AdditionalServiceWithData[] = [];

  @Input()
  otherTickets: TicketIdentifier[] | null = null;

  @Output()
  moveAdditionalServiceRequest: EventEmitter<MoveAdditionalServiceRequest> = new EventEmitter<MoveAdditionalServiceRequest>();

  constructor(private i18nService: I18nService) { }

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

  get hasAdditionalServices(): boolean {
    return this.additionalServicesForm != null;
  }

  getAdditionalServiceForm(idx: number): FormGroup | undefined {
    return this.additionalServicesForm.at(idx)?.get('additional') as FormGroup | undefined;
  }

  additionalServiceTitle(title: { [p: string]: string }): string {
    return title[this.i18nService.getCurrentLang()];
  }

  moveAdditionalServiceItem(index: number, asw: AdditionalServiceWithData, tkt: TicketIdentifier): void {
    this.moveAdditionalServiceRequest.emit({
      index,
      itemId: asw.itemId,
      currentTicketUuid: asw.ticketUUID,
      newTicketUuid: tkt.uuid
    });
  }
}
