import { Component, OnInit, OnDestroy } from '@angular/core';
import { EventService } from '../shared/event.service';
import { Router } from '@angular/router';
import { BasicEventInfo } from '../model/basic-event-info';
import { I18nService } from '../shared/i18n.service';
import { Language } from '../model/event';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit, OnDestroy {

  events: BasicEventInfo[];
  languages: Language[];
  private titleSub: Subscription;

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

    this.titleSub = this.i18nService.setPageTitle('event-list.header.title', '');
  }

  public ngOnDestroy(): void {
    this.i18nService.unsetPageTitle(this.titleSub);
  }
}
