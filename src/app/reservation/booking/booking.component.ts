import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TicketService } from 'src/app/shared/ticket.service';
import { ReservationInfo, TicketsByTicketCategory } from 'src/app/model/reservation-info';
import { EventService } from 'src/app/shared/event.service';
import { Event } from 'src/app/model/event';
import { zip } from 'rxjs';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {

  reservationInfo: ReservationInfo;
  event: Event;
  contactAndTicketsForm: FormGroup;
  eventShortName: string;
  reservationId: string;
  expired: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private ticketService: TicketService,
    private eventService: EventService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      zip(this.eventService.getEvent(this.eventShortName), this.reservationService.getReservationInfo(this.eventShortName, this.reservationId)).subscribe(([ev, reservationInfo]) => {
        this.event = ev;
        this.reservationInfo = reservationInfo;

        let invoiceRequested = ev.invoicingConfiguration.onlyInvoice ? true : reservationInfo.invoiceRequested;

        this.contactAndTicketsForm = this.formBuilder.group({
          firstName: this.formBuilder.control(this.reservationInfo.firstName, [Validators.required, Validators.maxLength(255)]),
          lastName: this.formBuilder.control(this.reservationInfo.lastName, [Validators.required, Validators.maxLength(255)]),
          email: this.formBuilder.control(this.reservationInfo.email, [Validators.required, Validators.maxLength(255)]),
          tickets: this.buildTicketsFormGroup(this.reservationInfo.ticketsByCategory),
          invoiceRequested: invoiceRequested,
          addCompanyBillingDetails: this.reservationInfo.addCompanyBillingDetails
        });
      });
    });
  }

  private buildTicketsFormGroup(ticketsByCategory: TicketsByTicketCategory[]): FormGroup {
    let tickets = {};
    ticketsByCategory.forEach(t => {
      t.tickets.forEach((ticket) => {
        tickets[ticket.uuid] = this.ticketService.buildFormGroupForTicket(ticket);
      })
    });
    return this.formBuilder.group(tickets);
  }

  public submitForm() {
    this.reservationService.validateToOverview(this.eventShortName, this.reservationId, this.contactAndTicketsForm.value).subscribe(res => {
      if (res.success) {
        this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'overview'])
      }
    })
  }

  public cancelPendingReservation() {
    this.reservationService.cancelPendingReservation(this.eventShortName, this.reservationId).subscribe(res => {
      this.router.navigate(['event', this.eventShortName]);
    });
  }

  handleExpired(expired: boolean) {
    this.expired = expired;
  }

}
