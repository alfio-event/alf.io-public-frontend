import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';

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
    private eventService: EventService,
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

}
