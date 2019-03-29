import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../shared/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  overview: any;
  overviewForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.params.subscribe(params => {

      this.reservationService.getOverview(params['eventShortName'], params['reservationId']).subscribe(resInfo => {
        // TODO: move as a guard(?)
        if (resInfo.viewState && (resInfo.viewState as string).endsWith("/book")) {
          this.router.navigate(['event', params['eventShortName'], 'reservation', params['reservationId'], 'book'])
          return;
        }
        if (resInfo.viewState && (resInfo.viewState as string).endsWith("/success")) {
          this.router.navigate(['event', params['eventShortName'], 'reservation', params['reservationId'], 'success'])
          return;
        }
        //

        this.overview = resInfo;

        this.overviewForm = this.formBuilder.group({
          termAndConditionsAccepted: null,
          privacyPolicyAccepted: null
        });

      });
    });
  }

  backToBooking(eventShortName: string, reservationId: string) {
    this.reservationService.backToBooking(eventShortName, reservationId).subscribe(res => {
      this.router.navigate(['event', eventShortName, 'reservation', reservationId, 'book'])
    });
  }

  confirm(eventShortName: string, reservationId: string, overviewFormValue) {
    this.reservationService.confirmOverview(eventShortName, reservationId, overviewFormValue).subscribe(res => {
      if(res.viewState && (res.viewState as string).endsWith("/success")) {
        this.router.navigate(['event', eventShortName, 'reservation', reservationId, 'success']);
      }
    });
  }

}
