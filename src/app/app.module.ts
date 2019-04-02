import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { HttpClientModule, HttpClientXsrfModule, HttpClient }    from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle, faGift, faTicketAlt } from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock } from '@fortawesome/free-regular-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import {TranslateModule, TranslateLoader} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';

import { BookingComponent } from './reservation/booking/booking.component';
import { OverviewComponent } from './reservation/overview/overview.component';
import { SuccessComponent } from './reservation/success/success.component';
import { ReservationComponent } from './reservation/reservation.component';
import { EventHeaderComponent } from './event-header/event-header.component';



// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, '/api/v2/public/i18n/', '');
}

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventDisplayComponent,
    BookingComponent,
    OverviewComponent,
    SuccessComponent,
    ReservationComponent,
    EventHeaderComponent
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
    ReactiveFormsModule,
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: HttpLoaderFactory,
          deps: [HttpClient]
      }
  })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    library.add(faInfoCircle, faGift, faTicketAlt);
    library.add(faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock);
    library.add(faGoogle);
  }
}
