import { Component, OnInit } from '@angular/core';
import { BasicEventInfo } from '../model/basic-event-info';
import { Language } from '../model/event';
import { EventService } from '../shared/event.service';
import { I18nService } from '../shared/i18n.service';
import { Router } from '@angular/router';
import { InfoService } from '../shared/info.service';
import { AnalyticsService } from '../shared/analytics.service';
import { TranslateService } from '@ngx-translate/core';
import { zip } from 'rxjs';

@Component({
  selector: 'app-event-list-all',
  templateUrl: './event-list-all.component.html',
  styleUrls: ['./event-list-all.component.scss']
})
export class EventListAllComponent implements OnInit {

  events: BasicEventInfo[];
  languages: Language[];

  constructor(
    private eventService: EventService,
    private i18nService: I18nService,
    private router: Router,
    public translate: TranslateService,
    private info: InfoService,
    private analytics: AnalyticsService) { }

    public ngOnInit(): void {

      zip(this.eventService.getEvents(), this.info.getInfo()).subscribe(([res, info]) => {
        if (res.length === 1) {
          this.router.navigate(['/event', res[0].shortName], {replaceUrl: true});
        } else {
          this.events = res;
          this.analytics.pageView(info.analyticsConfiguration);
        }
      });

      this.i18nService.getAvailableLanguages().subscribe(res => {
        this.languages = res;
      });

      this.i18nService.setPageTitle('event-list.header.title', null);
    }
}
