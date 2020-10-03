import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { BookingComponent } from './reservation/booking/booking.component';
import { OverviewComponent } from './reservation/overview/overview.component';
import { SuccessComponent } from './reservation/success/success.component';
import { OfflinePaymentComponent } from './reservation/offline-payment/offline-payment.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { ReservationGuard } from './reservation/reservation.guard';
import { ProcessingPaymentComponent } from './reservation/processing-payment/processing-payment.component';
import { LanguageGuard } from './language.guard';
import { NotFoundComponent } from './reservation/not-found/not-found.component';
import { EventGuard } from './event.guard';
import { ErrorComponent } from './reservation/error/error.component';
import { DeferredOfflinePaymentComponent } from './reservation/deferred-offline-payment/deferred-offline-payment.component';
import { UpdateTicketComponent } from './update-ticket/update-ticket.component';

const reservationsGuard = [EventGuard, LanguageGuard, ReservationGuard];

function pollModule(): Promise<any> {

  // s = "webjars/alfio-public-frontend/cbc7ff6aca/alfio-public-frontend/runtime-es2015.a6edc528ae9f87c845f6.js"
  let s = document.querySelector('script[type=module]').getAttribute('src')
  // module path = "webjars/alfio-public-frontend/cbc7ff6aca/alfio-public-frontend"
  let modulePath = s.substring(0, s.lastIndexOf('/'))

  if (modulePath == '') {
    return import('./poll/poll.module');
  } else {
    return import ('./'+modulePath+'/poll/poll.module');
  }
}

const routes: Routes = [
  { path: '', component: EventListComponent, canActivate: [LanguageGuard] },
  { path: 'event/:eventShortName', component: EventDisplayComponent, canActivate: [EventGuard, LanguageGuard] },
  { path: 'event/:eventShortName/poll', loadChildren: () => pollModule().then(m => m.PollModule), canActivate: [EventGuard, LanguageGuard] },
  { path: 'event/:eventShortName/reservation/:reservationId', children: [
    { path: 'book', component: BookingComponent, canActivate: reservationsGuard },
    { path: 'overview', component: OverviewComponent, canActivate: reservationsGuard },
    { path: 'waitingPayment', redirectTo: 'waiting-payment'},
    { path: 'waiting-payment', component: OfflinePaymentComponent, canActivate: reservationsGuard },
    { path: 'deferred-payment', component: DeferredOfflinePaymentComponent, canActivate: reservationsGuard },
    { path: 'processing-payment', component: ProcessingPaymentComponent, canActivate: reservationsGuard },
    { path: 'success', component: SuccessComponent, canActivate: reservationsGuard },
    { path: 'not-found', component: NotFoundComponent, canActivate: reservationsGuard },
    { path: 'error', component: ErrorComponent, canActivate: reservationsGuard },
  ]},
  { path: 'event/:eventShortName/ticket/:ticketId', children: [
    { path: 'view', component: ViewTicketComponent, canActivate: [EventGuard, LanguageGuard] },
    { path: 'update', component: UpdateTicketComponent, canActivate: [EventGuard, LanguageGuard] }
  ]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
