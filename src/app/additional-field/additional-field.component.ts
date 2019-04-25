import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Ticket, AdditionalField } from '../model/ticket';

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

  constructor() { }
}
