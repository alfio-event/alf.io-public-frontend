import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from '../shared/reservation.service';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { TicketCategories } from '../model/ticket-categories';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.css']
})
export class EventDisplayComponent implements OnInit {

  event: Event;
  ticketCategories: TicketCategories;
  reservationForm: FormGroup;

  //https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    private translate: TranslateService) { }

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

  createItems(ticketCategories: TicketCategories): FormGroup[] {
    return ticketCategories.categories.map(category => this.formBuilder.group({ticketCategoryId: category.id, amount: 0}));
  }

  submitForm(eventShortName, reservation) {
    this.reservationService.reserveTickets(eventShortName, reservation).subscribe(res => {
      if (res.reservationIdentifier) {
        this.router.navigate(['event', eventShortName, 'reservation', res.reservationIdentifier ,'book'])
      }
    });
  }
}