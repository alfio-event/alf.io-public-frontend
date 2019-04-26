import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';
import { TicketService } from 'src/app/shared/ticket.service';
import { BookingInfo, TicketsByTicketCategory } from 'src/app/model/booking-info';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html'
})
export class BookingComponent implements OnInit {

  bookingInfo: BookingInfo;
  contactAndTicketsForm: FormGroup;
  eventShortName: string;
  reservationId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private ticketService: TicketService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      this.reservationService.getBookingInfo(this.eventShortName, this.reservationId).subscribe(bookingInfo => {
        
        this.bookingInfo = bookingInfo;
        this.contactAndTicketsForm = this.formBuilder.group({
          firstName: this.bookingInfo.firstName,
          lastName: this.bookingInfo.lastName,
          email: this.bookingInfo.email,
          tickets: this.buildTicketsFormGroup(this.bookingInfo.ticketsByCategory)
        });
      })
    });
  }

  getControlFormForAdditionalFields(uuid: string): AbstractControl {
    return this.contactAndTicketsForm.get('tickets.'+uuid+'.additional');
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

}
