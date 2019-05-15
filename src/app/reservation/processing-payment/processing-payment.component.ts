import { Component, OnInit } from '@angular/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { ActivatedRoute } from '@angular/router';
import { ReservationService } from 'src/app/shared/reservation.service';
import { EventService } from 'src/app/shared/event.service';
import { zip } from 'rxjs';
import { Event } from 'src/app/model/event';

@Component({
  selector: 'app-processing-payment',
  templateUrl: './processing-payment.component.html',
  styleUrls: ['./processing-payment.component.scss']
})
export class ProcessingPaymentComponent implements OnInit {

  reservationInfo: ReservationInfo;
  event: Event;

  eventShortName: string;
  reservationId: string;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService,
    private eventService: EventService,
    ) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      zip(this.eventService.getEvent(this.eventShortName), this.reservationService.getReservationInfo(this.eventShortName, this.reservationId)).subscribe(res => {
        this.event = res[0];
        this.reservationInfo = res[1];
      })
      
    });

  }

}
