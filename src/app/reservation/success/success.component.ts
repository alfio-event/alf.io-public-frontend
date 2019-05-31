import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { TicketService } from 'src/app/shared/ticket.service';
import { Ticket } from 'src/app/model/ticket';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { I18nService } from 'src/app/shared/i18n.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  reservationInfo: ReservationInfo;
  eventShortName: string;
  reservationId: string;

  event: Event;

  reservationMailSent: boolean = false;
  sendEmailForTicketStatus: {} = {};
  ticketsFormControl: {} = {};
  ticketsFormShow: {} = {};
  ticketsReleaseShow: {} = {};

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private eventService: EventService,
    private ticketService: TicketService,
    private i18nService: I18nService) { }

  public ngOnInit(): void {
    this.route.parent.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];
      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.event = ev;
        this.i18nService.setPageTitle('reservation-page-complete.header.title', ev.displayName);
      });
      this.loadReservation();
    });
  }

  private loadReservation(): void {
    this.reservationService.getReservationInfo(this.eventShortName, this.reservationId).subscribe(res => {
      this.reservationInfo = res;
      res.ticketsByCategory.forEach((tc) => {
        tc.tickets.forEach((ticket: Ticket) => {
          this.buildFormControl(ticket);
        })  
      });
    }, err => {
      //reservation has been cancelled!
      if (err instanceof HttpErrorResponse && err.status === 404) {
        this.router.navigate(['event', this.eventShortName]);
      } else {
        console.log('error while loading reservation ', this.reservationId)
      }
    })
  }

  private buildFormControl(ticket: Ticket): void {
    this.ticketsFormControl[ticket.uuid] = this.ticketService.buildFormGroupForTicket(ticket);
  }

  sendEmailForTicket(ticketIdentifier: string): void {
    this.ticketService.sendTicketByEmail(this.eventShortName, ticketIdentifier).subscribe(res => {
      if (res) {
        this.sendEmailForTicketStatus[ticketIdentifier] = 'SENT';
      }
    });
  }

  reSendReservationEmail(): void {
    this.reservationService.reSendReservationEmail(this.eventShortName, this.reservationId).subscribe(res => {
      this.reservationMailSent = res;
    });
  }

  updateTicket(uuid: string): void {
    const ticketValue = this.ticketsFormControl[uuid].value;
    this.ticketService.updateTicket(this.event.shortName, uuid, ticketValue).subscribe(res => {
      if (res.success) {
        this.loadReservation();
      }
    });
  }

  releaseTicket(ticket: Ticket) {
    console.log('release ticket', ticket);
    this.ticketService.releaseTicket(this.event.shortName, ticket.uuid).subscribe(res => {
      this.loadReservation();
    });
  }

}
