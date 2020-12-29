import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { BasicSubscriptionInfo } from '../model/subscription';
import { AnalyticsService } from '../shared/analytics.service';
import { I18nService } from '../shared/i18n.service';
import { InfoService } from '../shared/info.service';
import { SubscriptionService } from '../shared/subscription.service';
import { zip } from 'rxjs';
import { Language } from '../model/event';

@Component({
  selector: 'app-subscription-list-all',
  templateUrl: './subscription-list-all.component.html',
  styleUrls: ['./subscription-list-all.component.scss']
})
export class SubscriptionListAllComponent implements OnInit {


  subscriptions: BasicSubscriptionInfo[];
  languages: Language[];

  constructor(private subscriptionService: SubscriptionService,
    private i18nService: I18nService,
    private router: Router,
    public translate: TranslateService,
    private info: InfoService,
    private analytics: AnalyticsService) { }

  ngOnInit(): void {
    zip(this.subscriptionService.getSubscriptions(), this.info.getInfo()).subscribe(([res, info]) => {
      if (res.length === 1) {
        this.router.navigate(['/subscription', res[0].id], {replaceUrl: true});
      } else {
        this.subscriptions = res;
        this.analytics.pageView(info.analyticsConfiguration);
      }
    });

    this.i18nService.getAvailableLanguages().subscribe(res => {
      this.languages = res;
    });

    this.i18nService.setPageTitle('subscription.header.title', '');
  }

}
