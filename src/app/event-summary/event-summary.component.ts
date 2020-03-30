import { Component, Input } from '@angular/core';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { DateValidity } from '../model/date-validity';
import { shouldDisplayTimeZoneInfo } from '../shared/event.service';

@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html'
})
export class EventSummaryComponent {

  @Input()
  event: Event;

  @Input()
  dateValidityProvider: DateValidity;

  constructor(public translate: TranslateService) { }

  get displayTimeZoneInfo(): boolean {
    return shouldDisplayTimeZoneInfo(this.event);
  }

  get localizedStartDateForMultiDay(): string {
    return this.translate.instant('event-days.not-same-day', {
      '0': this.dateValidityProvider.formattedBeginDate[this.translate.currentLang],
      '1': this.dateValidityProvider.formattedBeginTime[this.translate.currentLang]
    });
  }

  get localizedEndDateForMultiDay(): string {
    return this.translate.instant('event-days.not-same-day', {
      '0': this.dateValidityProvider.formattedEndDate[this.translate.currentLang],
      '1': this.dateValidityProvider.formattedEndTime[this.translate.currentLang]
    });
  }

  get isEventOnline(): boolean {
    return this.event.format == 'ONLINE';
  }

}
