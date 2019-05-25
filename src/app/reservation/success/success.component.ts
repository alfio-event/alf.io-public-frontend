import { Component, OnInit, OnDestroy } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';
import { TicketService } from 'src/app/shared/ticket.service';
import { Ticket } from 'src/app/model/ticket';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { I18nService } from 'src/app/shared/i18n.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit, OnDestroy {

  reservationInfo: ReservationInfo;
  eventShortName: string;
  reservationId: string;

  event: Event;

  reservationMailSent: boolean = false;
  sendEmailForTicketStatus: {} = {};
  ticketsFormControl: {} = {};
  ticketsFormShow: {} = {};

  private titleSub: Subscription;

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
        this.titleSub = this.i18nService.setPageTitle('reservation-page-complete.header.title', ev.displayName);
      });
      this.loadReservation();
    });
  }

  public ngOnDestroy(): void {
    this.i18nService.unsetPageTitle(this.titleSub);
  }

  private loadReservation(): void {
    this.reservationService.getReservationInfo(this.eventShortName, this.reservationId).subscribe(res => {
      this.reservationInfo = res;
      res.ticketsByCategory.forEach((tc) => {
        tc.tickets.forEach((ticket: Ticket) => {
          this.buildFormControl(ticket);
        })  
      });
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

}
