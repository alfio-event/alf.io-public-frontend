import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { Router } from '@angular/router';
import { BasicEventInfo } from '../model/basic-event-info';
import { I18nService } from '../shared/i18n.service';
import { Language } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../shared/analytics.service';
import { InfoService } from '../shared/info.service';
import { zip } from 'rxjs';
import { removeAllCustomEventCss } from '../shared/custom-css-helper'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  events: BasicEventInfo[];
  allEvents: BasicEventInfo[];
  languages: Language[];

  constructor(
    private eventService: EventService,
    private i18nService: I18nService,
    private router: Router,
    public translate: TranslateService,
    private info: InfoService,
    private analytics: AnalyticsService) { }

    public ngOnInit(): void {

      removeAllCustomEventCss();

      zip(this.eventService.getEvents(), this.info.getInfo()).subscribe(([res, info]) => {
        if (res.length === 1) {
          this.router.navigate(['/event', res[0].shortName], {replaceUrl: true});
        } else {
          this.allEvents = res;
          this.events = this.allEvents.slice(0, 4);
          this.analytics.pageView(info.analyticsConfiguration);
        }
      });

      this.i18nService.getAvailableLanguages().subscribe(res => {
        this.languages = res;
      });

      this.i18nService.setPageTitle('event-list.header.title', '');
    }

}
