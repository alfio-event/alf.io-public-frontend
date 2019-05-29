import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ReservationService } from '../shared/reservation.service';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { TicketCategory } from '../model/ticket-category';
import { ReservationRequest } from '../model/reservation-request';
import { handleServerSideValidationError } from '../shared/validation-helper';
import { zip } from 'rxjs';
import { AdditionalService } from '../model/additional-service';
import { I18nService } from '../shared/i18n.service';
import { WaitingListSubscriptionRequest } from '../model/waiting-list-subscription-request';
import { TicketCategoryForWaitingList } from '../model/items-by-category';

@Component({
  selector: 'app-event-display',
  templateUrl: './event-display.component.html',
  styleUrls: ['./event-display.component.css']
})
export class EventDisplayComponent implements OnInit {

  event: Event;
  ticketCategories: TicketCategory[];
  //
  supplementCategories: AdditionalService[];
  donationCategories: AdditionalService[];
  //
  reservationForm: FormGroup;
  globalErrors: string[] = [];
  //
  ticketCategoryAmount: {[key:number]: number[]};
  //

  //
  preSales: boolean;
  waitingList: boolean;
  ticketCategoriesForWaitingList: TicketCategoryForWaitingList[];
  waitingListForm: FormGroup;
  waitingListRequestSubmitted: boolean;
  waitingListRequestResult: boolean;
  //

  //https://alligator.io/angular/reactive-forms-formarray-dynamic-fields/

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventService: EventService,
    private reservationService: ReservationService,
    private formBuilder: FormBuilder,
    public translate: TranslateService,
    private i18nService: I18nService) { }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {

      const eventShortName = params['eventShortName'];

      zip(this.eventService.getEvent(eventShortName), this.eventService.getEventTicketsInfo(eventShortName)).subscribe( ([event, itemsByCat]) => {
        this.event = event;


        this.i18nService.setPageTitle('show-event.header.title', event.displayName);

        this.reservationForm = this.formBuilder.group({
          reservation: this.formBuilder.array(this.createItems(itemsByCat.ticketCategories)),
          additionalService: this.formBuilder.array([]),
          captcha: null
        });
        this.ticketCategories = itemsByCat.ticketCategories;

        this.ticketCategoryAmount = {};
        this.ticketCategories.forEach(tc => {
          this.ticketCategoryAmount[tc.id] = [];
          for (let i = 0; i <= tc.maximumSaleableTickets; i++) {
            this.ticketCategoryAmount[tc.id].push(i);
          }
        });
        this.supplementCategories = itemsByCat.additionalServices.filter(e => e.type === 'SUPPLEMENT');
        this.donationCategories = itemsByCat.additionalServices.filter(e => e.type === 'DONATION');

        this.preSales = itemsByCat.preSales;
        this.waitingList = itemsByCat.waitingList;
        this.ticketCategoriesForWaitingList = itemsByCat.ticketCategoriesForWaitingList;
        if(this.waitingList) {
          this.waitingListForm = this.formBuilder.group({
            firstName: null,
            lastName: null,
            email: null,
            selectedCategory: null,
            userLanguage: null,
            termAndConditionsAccepted: null,
            privacyPolicyAccepted: null
          });
        }
      });  
    })
  }

  private createItems(ticketCategories: TicketCategory[]): FormGroup[] {
    return ticketCategories.map(category => this.formBuilder.group({ticketCategoryId: category.id, amount: 0}));
  }

  submitForm(eventShortName: string, reservation: ReservationRequest) {
    this.reservationService.reserveTickets(eventShortName, reservation).subscribe(res => {
      if (res.success) {
        this.router.navigate(['event', eventShortName, 'reservation', res.value ,'book'])
      }
    }, (err) => {
      this.globalErrors = handleServerSideValidationError(err, this.reservationForm);
    });
  }

  submitWaitingListRequest(eventShortName: string, waitingListSubscriptionRequest: WaitingListSubscriptionRequest) {

    this.reservationService.submitWaitingListSubscriptionRequest(eventShortName, waitingListSubscriptionRequest).subscribe(res => {
      this.waitingListRequestSubmitted = true;
      this.waitingListRequestResult = res.value;
    }, (err) => {
      this.globalErrors = handleServerSideValidationError(err, this.waitingListForm);
    });
  }

  public handleRecaptchaResponse(recaptchaValue: string): void {
    this.reservationForm.get('captcha').setValue(recaptchaValue);
  }
}