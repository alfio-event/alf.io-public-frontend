import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { TicketService } from 'src/app/shared/ticket.service';
import { Ticket } from 'src/app/model/ticket';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  success: any;
  eventShortName: string;
  reservationId: string;

  event: Event;

  reservationMailSent: boolean = false;
  sendEmailForTicketStatus: {} = {};
  ticketsFormControl: {} = {};
  ticketsFormShow: {} = {};


  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private eventService: EventService,
    private ticketService: TicketService) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];
      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.event = ev;
      });
      this.reservationService.getSuccess(this.eventShortName, this.reservationId).subscribe(res => {
        this.success = res;
        res.ticketsByCategory.forEach((tc) => {
          tc.tickets.forEach((ticket: Ticket) => {
            this.buildFormControl(ticket);
          })  
        });
      })
    });
  }

  buildFormControl(ticket: Ticket) {
    this.ticketsFormControl[ticket.uuid] = this.ticketService.buildFormGroupForTicket(ticket);
  }

  sendEmailForTicket(ticketIdentifier: string): void {
    this.ticketService.sendTicketByEmail(this.eventShortName, ticketIdentifier).subscribe(res => {
      if (res) {
        this.sendEmailForTicketStatus[ticketIdentifier] = 'SENT';
      }
    });
  }

  reSendReservationEmail() {
    this.reservationService.reSendReservationEmail(this.eventShortName, this.reservationId).subscribe(res => {
      this.reservationMailSent = res;
    });
  }

  getControlFormForAdditionalFields(uuid: string): AbstractControl {
    return this.ticketsFormControl[uuid].get('additional');
  }

  updateTicket(uuid: string) {
    console.log('update ticket with uuid ' + uuid, this.ticketsFormControl[uuid].value);
  }

}
