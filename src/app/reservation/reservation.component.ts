import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../shared/reservation.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  private reservation: any;

  constructor(
    private route: ActivatedRoute,
    private reservationService: ReservationService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.reservationService.getReservationInfo(params['eventShortName'], params['reservationId']).subscribe(resInfo => {
        this.reservation = resInfo;
      })
    });
  }

}
