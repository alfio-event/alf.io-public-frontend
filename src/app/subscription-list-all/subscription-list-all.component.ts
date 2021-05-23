import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BasicSubscriptionInfo } from '../model/subscription';
import { AnalyticsService } from '../shared/analytics.service';
import { I18nService } from '../shared/i18n.service';
import { InfoService } from '../shared/info.service';
import { SubscriptionService } from '../shared/subscription.service';
import { zip } from 'rxjs';
import {Language, TermsPrivacyLinksContainer} from '../model/event';
import {globalTermsPrivacyLinks} from '../model/info';
import {filterAvailableLanguages} from '../model/purchase-context';

@Component({
  selector: 'app-subscription-list-all',
  templateUrl: './subscription-list-all.component.html',
  styleUrls: ['./subscription-list-all.component.scss']
})
export class SubscriptionListAllComponent implements OnInit {


  subscriptions: BasicSubscriptionInfo[];
  languages: Language[];
  linksContainer: TermsPrivacyLinksContainer;

  constructor(private subscriptionService: SubscriptionService,
    private i18nService: I18nService,
    private router: Router,
    public translate: TranslateService,
    private info: InfoService,
    private analytics: AnalyticsService) { }

  ngOnInit(): void {
    zip(this.subscriptionService.getSubscriptions(), this.info.getInfo(), this.i18nService.getAvailableLanguages()).subscribe(([res, info, activeLanguages]) => {
      if (res.length === 1) {
        this.router.navigate(['/subscription', res[0].id], {replaceUrl: true});
      } else {
        this.subscriptions = res;
        this.analytics.pageView(info.analyticsConfiguration);
        this.linksContainer = globalTermsPrivacyLinks(info);
        this.languages = filterAvailableLanguages(activeLanguages, res);
        this.i18nService.setPageTitle('subscription.header.title', null);
      }
    });

  }

}
