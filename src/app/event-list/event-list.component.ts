import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { Router } from '@angular/router';
import { BasicEventInfo } from '../model/basic-event-info';
import { I18nService } from '../shared/i18n.service';
import { Language } from '../model/event';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit {

  events: BasicEventInfo[];
  languages: Language[];

  constructor(
    private eventService: EventService, 
    private i18nService: I18nService,
    private router: Router) { }

  public ngOnInit(): void {
    this.eventService.getEvents().subscribe(res => {
      if(res.length === 1) {
        this.router.navigate(['/event', res[0].shortName]);
      } else {
        this.events = res;
      }
    });

    this.i18nService.getAvailableLanguages().subscribe(res => {
      this.languages = res;
    });

    this.i18nService.setPageTitle('event-list.header.title', '');
  }
}
