import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../../shared/reservation.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {

  reservation: any;
  contactAndTicketsForm: FormGroup;
  eventShortName: string;
  reservationId: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.route.parent.params.subscribe(params => {

      this.eventShortName = params['eventShortName'];
      this.reservationId = params['reservationId'];

      this.reservationService.getReservationInfo(this.eventShortName, this.reservationId).subscribe(resInfo => {

        if (resInfo.viewState && (resInfo.viewState as string).endsWith("/overview")) {
          this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'overview'])
          return;
        }
        if (resInfo.viewState && (resInfo.viewState as string).endsWith("/success")) {
          this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'success'])
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

  getControlFormForAdditionalFields(uuid: string): AbstractControl {
    return this.contactAndTicketsForm.get('tickets.'+uuid+'.additional');
  }

  private buildTicketsFormGroup(ticketsByCategory): FormGroup {
    let tickets = {};
    ticketsByCategory.forEach(t => {
      t.tickets.forEach(ticket => {
        tickets[ticket.uuid] = this.formBuilder.group({
          firstName: null,
          lastName: null,
          email: null,
          additional: this.buildAdditionalFields(ticket.ticketFieldConfigurationBeforeStandard, ticket.ticketFieldConfigurationAfterStandard)
        });
      })
    });
    return this.formBuilder.group(tickets);
  }

  private buildAdditionalFields(before, after) : FormGroup {
    let additional = {};
    if (before) {
      this.buildSingleAdditionalField(before, additional);
    }
    if (after) {
      this.buildSingleAdditionalField(after, additional);
    }
    return this.formBuilder.group(additional);
  }

  private buildSingleAdditionalField(a, additional) {
    a.forEach(f => {
      const arr = [];
      f.fields.forEach(field => {
        arr.push(this.formBuilder.control(null));
      });
      additional[f.name] = this.formBuilder.array(arr)
    })
  }


  public submitForm(contactAndTicketsInfo: any) {
    console.log(`${this.eventShortName} ${this.reservationId}`, contactAndTicketsInfo);
    this.reservationService.validateToOverview(this.eventShortName, this.reservationId, contactAndTicketsInfo).subscribe(res => {
      console.log(res);
      if (res.viewState && (res.viewState as string).endsWith("/overview")) {
        this.router.navigate(['event', this.eventShortName, 'reservation', this.reservationId, 'overview'])
      }
    })
  }

  public cancelPendingReservation() {
    this.reservationService.cancelPendingReservation(this.eventShortName, this.reservationId).subscribe(res => {
      console.log(res);
      this.router.navigate(['event', this.eventShortName]);
    });
  }

}
