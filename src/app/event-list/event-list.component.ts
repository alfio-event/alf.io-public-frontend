import { Component, OnInit } from '@angular/core';
import { EventService, shouldDisplayTimeZoneInfo } from '../shared/event.service';
import { Router } from '@angular/router';
import { BasicEventInfo } from '../model/basic-event-info';
import { I18nService } from '../shared/i18n.service';
import {Language, TermsPrivacyLinksContainer} from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { AnalyticsService } from '../shared/analytics.service';
import { InfoService } from '../shared/info.service';
import { zip } from 'rxjs';
import { removeAllCustomEventCss } from '../shared/custom-css-helper'

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent implements OnInit {

  events: Array<BasicEventInfo[]>;
  languages: Language[];
  linksContainer: TermsPrivacyLinksContainer;

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
          const chunkSize = 2;
          // thanks to https://gist.github.com/webinista/11240585#gistcomment-2363393
          this.events = res.reduce((prevVal: any, currVal: any, currIndx: number, array: Array<BasicEventInfo>) =>
                        !(currIndx % chunkSize) ? prevVal.concat([array.slice(currIndx, currIndx + chunkSize)]) : prevVal, []);
          this.analytics.pageView(info.analyticsConfiguration);
          this.linksContainer = { privacyPolicyUrl: info.globalPrivacyPolicyUrl, termsAndConditionsUrl: info.globalTermsUrl };
        }
      });

      this.i18nService.getAvailableLanguages().subscribe(res => {
        this.languages = res;
      });

      this.i18nService.setPageTitle('event-list.header.title', '');
    }

    public displayTimeZoneInfo(event: BasicEventInfo): boolean {
      return shouldDisplayTimeZoneInfo(event);
    }

    public isEventOnline(event: BasicEventInfo): boolean {
      return event.format === 'ONLINE';
    }

}
