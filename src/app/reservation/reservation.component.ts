import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.scss']
})
export class ReservationComponent implements OnInit {

  reservation: any;
  contactAndTicketsForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.reservationService.getReservationInfo(params['eventShortName'], params['reservationId']).subscribe(resInfo => {

        if (resInfo.viewState && (resInfo.viewState as string).endsWith("/overview")) {
          //redirect to overwiew!
          this.router.navigate(['event', params['eventShortName'], 'reservation', params['reservationId'], 'overview'])
          return;
        }

        this.reservation = resInfo;
        this.contactAndTicketsForm = this.formBuilder.group({
          firstName: null,
          lastName: null,
          email: null,
          tickets: this.buildTicketsFormGroup(this.reservation.ticketsByCategory)
        });
      })
    });
  }

  private buildTicketsFormGroup(ticketsByCategory): FormGroup {
    let tickets = {};
    ticketsByCategory.forEach(t => {
      t.tickets.forEach(ticket => {
        tickets[ticket.uuid] = this.formBuilder.group({
          firstName: null,
          lastName: null,
          email: null
        });
      })
    });
    return this.formBuilder.group(tickets);
  }


  public submitForm(eventShortName: string, reservationId: string, contactAndTicketsInfo: any) {
    console.log(`${eventShortName} ${reservationId}`, contactAndTicketsInfo);
    this.reservationService.validateToOverview(eventShortName, reservationId, contactAndTicketsInfo).subscribe(res => {
      console.log(res);
      if (res.viewState && (res.viewState as string).endsWith("/overview")) {
        this.router.navigate(['event', eventShortName, 'reservation', reservationId, 'overview'])
      }
    })
  }

}
