import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.scss']
})
export class SuccessComponent implements OnInit {

  success: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {
      this.reservationService.getSuccess(params['eventShortName'], params['reservationId']).subscribe(res => {
        this.success = res;
      })
    });
  }

}
