import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from '../shared/reservation.service';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { TicketCategory } from '../model/ticket-category';
import { ReservationRequest } from '../model/reservation-request';
import { ValidatedResponse } from '../model/validated-response';
import { HttpErrorResponse } from '@angular/common/http';
import { applyValidationErrors } from '../shared/validation-helper';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.css']
})
export class EventDisplayComponent implements OnInit {

  event: Event;
  ticketCategories: TicketCategory[];
  reservationForm: FormGroup;

  //https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    public translate: TranslateService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      const eventShortName = params['eventShortName'];

      this.eventService.getEvent(eventShortName).subscribe(e => {
        this.event = e;
      });

      this.eventService.getEventTicketsInfo(eventShortName).subscribe(e => {
        this.reservationForm = this.formBuilder.group({
          reservation: this.formBuilder.array(this.createItems(e))
        });
        this.ticketCategories = e;
      });
    })
  }

  createItems(ticketCategories: TicketCategory[]): FormGroup[] {
    return ticketCategories.map(category => this.formBuilder.group({ticketCategoryId: category.id, amount: 0}));
  }

  submitForm(eventShortName: string, reservation: ReservationRequest) {
    this.reservationService.reserveTickets(eventShortName, reservation).subscribe(res => {
      if (res.success) {
        this.router.navigate(['event', eventShortName, 'reservation', res.value ,'book'])
      }
    }, (err) => {
      if (err instanceof HttpErrorResponse) {
        if (err.status === 422) {
          const globalErrors = applyValidationErrors(this.reservationForm, err.error);
          console.log('global errors are', globalErrors);
        }
      }
    });
  }
}