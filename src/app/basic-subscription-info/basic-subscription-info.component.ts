import {Component, Input} from '@angular/core';
import {BasicSubscriptionInfo} from '../model/subscription';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-basic-subscription-info',
  templateUrl: './basic-subscription-info.component.html',
  styleUrls: ['./basic-subscription-info.component.scss']
})
export class BasicSubscriptionInfoComponent {
  @Input()
  subscription: BasicSubscriptionInfo;

  constructor(private translateService: TranslateService) {}

  get title(): string {
    return this.getLocalizedContent(this.subscription.title);
  }

  get description(): string {
    return this.getLocalizedContent(this.subscription.description);
  }
/*
  get hasOnSaleTo(): boolean {
    return this.subscription.formattedOnSaleTo != null;
  }

  get onSaleFrom(): string {
    return this.getLocalizedContent(this.subscription.formattedOnSaleFrom);
  }

  get onSaleTo(): string {
    return this.getLocalizedContent(this.subscription.formattedOnSaleTo);
  }

  get displayTimeZone(): boolean {
    const datesWithOffset = this.subscription.datesWithOffset;
    return isDifferentTimeZone(datesWithOffset.startDateTime, datesWithOffset.startTimeZoneOffset)
      || (datesWithOffset.endDateTime > 0 && isDifferentTimeZone(datesWithOffset.endDateTime, datesWithOffset.endTimeZoneOffset));
  }
*/
  private getLocalizedContent(container: {[k: string]: string}) {
    const localizedContent = container[this.translateService.currentLang];
    if (localizedContent != null) {
      return localizedContent;
    }
    return container[Object.keys(container)[0]];
  }

}
