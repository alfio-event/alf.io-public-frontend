import { Component, OnInit } from '@angular/core';
import { EventService } from 'src/app/shared/event.service';
import { ReservationService } from 'src/app/shared/reservation.service';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { Event } from 'src/app/model/event';

@Component({
  selector: 'app-offline-payment',
  templateUrl: './offline-payment.component.html',
  styleUrls: ['./offline-payment.component.scss']
})
export class OfflinePaymentComponent implements OnInit {

  reservationInfo: ReservationInfo;
  eventShortName: string;
  reservationId: string;

  event: Event;

  constructor(private eventService: EventService, private reservationService: ReservationService) { }

  ngOnInit() {
  }

}
