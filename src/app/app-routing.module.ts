import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { BookingComponent } from './reservation/booking/booking.component';
import { OverviewComponent } from './reservation/overview/overview.component';
import { SuccessComponent } from './reservation/success/success.component';
import { ReservationComponent } from './reservation/reservation.component';
import { OfflinePaymentComponent } from './reservation/offline-payment/offline-payment.component';
import { ViewTicketComponent } from './view-ticket/view-ticket.component';
import { ReservationGuard } from './reservation/reservation.guard';
import { ProcessingPaymentComponent } from './reservation/processing-payment/processing-payment.component';
import { LanguageGuard } from './language.guard';
import { NotFoundComponent } from './reservation/not-found/not-found.component';
import { EventGuard } from './event.guard';

const routes: Routes = [
  { path: '', component: EventListComponent, canActivate: [LanguageGuard] },
  { path: 'event/:eventShortName', component: EventDisplayComponent, canActivate: [EventGuard, LanguageGuard] },
  { path: 'event/:eventShortName/reservation/:reservationId', component: ReservationComponent, canActivate: [EventGuard, LanguageGuard, ReservationGuard], children: [
    { path: 'book', component: BookingComponent, canActivate: [ReservationGuard] },
    { path: 'overview', component: OverviewComponent, canActivate: [ReservationGuard] },
    { path: 'waitingPayment', redirectTo: 'waiting-payment'},
    { path: 'waiting-payment', component: OfflinePaymentComponent, canActivate: [ReservationGuard] },
    { path: 'processing-payment', component: ProcessingPaymentComponent, canActivate: [ReservationGuard] },
    { path: 'success', component: SuccessComponent, canActivate: [ReservationGuard]},
    { path: 'not-found', component: NotFoundComponent, canActivate: [ReservationGuard]}
  ]},
  { path: 'event/:eventShortName/ticket/:ticketId/view', component: ViewTicketComponent, canActivate: [EventGuard, LanguageGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
