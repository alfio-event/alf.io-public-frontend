import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { TicketService } from 'src/app/shared/ticket.service';

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
      })
    });
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

}
