import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { HttpClientModule, HttpClientXsrfModule }    from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle, faGift, faTicketAlt } from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock } from '@fortawesome/free-regular-svg-icons';
import { BookingComponent } from './booking/booking.component';
import { OverviewComponent } from './overview/overview.component';
import { SuccessComponent } from './success/success.component';
import { ReservationComponent } from './reservation/reservation.component';

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventDisplayComponent,
    BookingComponent,
    OverviewComponent,
    SuccessComponent,
    ReservationComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-CSRF-TOKEN',
    }),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    library.add(faInfoCircle, faGift, faTicketAlt);
    library.add(faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock);
  }
}
