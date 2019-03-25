import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from '../shared/reservation.service';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.css']
})
export class EventDisplayComponent implements OnInit {

  event: any;
  reservationForm: FormGroup;

  //https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.eventService.getEvent(params['eventShortName']).subscribe(e => {
        this.reservationForm = this.formBuilder.group({
          reservation: this.formBuilder.array(this.createItems(e))
        });
        this.event = e;
      })
    })
  }

  createItems(event): FormGroup[] {
    return event.ticketCategories.map(category => this.formBuilder.group({ticketCategoryId: category.id, amount: 0}));
  }

  submitForm(eventShortName, reservation) {
    this.reservationService.reserveTickets(eventShortName, reservation).subscribe(res => {
      if (res.reservationIdentifier) {
        this.router.navigate(['event', eventShortName, 'reservation', res.reservationIdentifier ,'book'])
      }
    });
  }
}