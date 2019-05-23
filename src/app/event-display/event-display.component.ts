import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from '../shared/reservation.service';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { TicketCategory } from '../model/ticket-category';
import { ReservationRequest } from '../model/reservation-request';
import { handleServerSideValidationError } from '../shared/validation-helper';
import { zip } from 'rxjs';
import { AdditionalService } from '../model/additional-service';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.css']
})
export class EventDisplayComponent implements OnInit {

  event: Event;
  ticketCategories: TicketCategory[];
  //
  supplementCategories: AdditionalService[];
  donationCategories: AdditionalService[];
  //
  reservationForm: FormGroup;
  globalErrors: string[] = [];

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

      zip(this.eventService.getEvent(eventShortName), this.eventService.getEventTicketsInfo(eventShortName)).subscribe( ([event, itemsByCat]) => {
        this.event = event;

        this.reservationForm = this.formBuilder.group({
          reservation: this.formBuilder.array(this.createItems(itemsByCat.ticketCategories)),
          additionalService: this.formBuilder.array([])
        });
        this.ticketCategories = itemsByCat.ticketCategories;
        this.supplementCategories = itemsByCat.additionalServices.filter(e => e.type === 'SUPPLEMENT');
        this.donationCategories = itemsByCat.additionalServices.filter(e => e.type === 'DONATION');
      });  
    })
  }

  private createItems(ticketCategories: TicketCategory[]): FormGroup[] {
    return ticketCategories.map(category => this.formBuilder.group({ticketCategoryId: category.id, amount: 0}));
  }

  submitForm(eventShortName: string, reservation: ReservationRequest) {
    this.reservationService.reserveTickets(eventShortName, reservation).subscribe(res => {
      if (res.success) {
        this.router.navigate(['event', eventShortName, 'reservation', res.value ,'book'])
      }
    }, (err) => {
      this.globalErrors = handleServerSideValidationError(err, this.reservationForm);
    });
  }
}