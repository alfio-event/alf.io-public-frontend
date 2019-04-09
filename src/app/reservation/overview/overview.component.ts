import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReservationService } from '../../shared/reservation.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Event } from 'src/app/model/event';
import { EventService } from 'src/app/shared/event.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  overview: any;
  overviewForm: FormGroup;

  eventShortName: string;
  reservationId: string;
  event: Event;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private eventService: EventService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        this.event = ev;
      });

      this.reservationService.getOverview(this.eventShortName, this.reservationId).subscribe(resInfo => {
        // TODO: move as a guard(?)
        if (resInfo.viewState && (resInfo.viewState as string).endsWith("/book")) {
          this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'book'])
          return;
        }
        if (resInfo.viewState && (resInfo.viewState as string).endsWith("/success")) {
          this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success'])
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

  backToBooking() {
    this.reservationService.backToBooking(this.eventShortName, this.reservationId).subscribe(res => {
      this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'book'])
    });
  }

  confirm(overviewFormValue: any) {
    this.reservationService.confirmOverview(this.eventShortName, this.reservationId, overviewFormValue).subscribe(res => {
      if(res.viewState && (res.viewState as string).endsWith("/success")) {
        this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success']);
      }
    });
  }

}
