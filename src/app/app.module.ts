import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventListComponent } from './event-list/event-list.component';
import { EventDisplayComponent } from './event-display/event-display.component';
import { HttpClientModule }    from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faInfoCircle, faGift, faTicketAlt } from '@fortawesome/free-solid-svg-icons'
import { faCalendarAlt, faCalendarPlus, faCalendarCheck, faCompass, faClock } from '@fortawesome/free-regular-svg-icons';

@NgModule({
  declarations: [
    AppComponent,
    EventListComponent,
    EventDisplayComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FontAwesomeModule
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
