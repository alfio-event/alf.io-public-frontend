import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Ticket } from 'src/app/model/ticket';

@Component({
  selector: 'app-ticket-form',
  templateUrl: './ticket-form.component.html'
})
export class TicketFormComponent {

  @Input()
  form: FormGroup;

  @Input()
  ticket: Ticket;

  constructor() { }
}