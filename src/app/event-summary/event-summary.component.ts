import { Component, Input } from '@angular/core';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';
import { DateValidity } from '../model/date-validity';

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
    const datesWithOffset = this.event.datesWithOffset;
    return EventSummaryComponent.differentTimeZone(datesWithOffset.startDateTime, datesWithOffset.startTimeZoneOffset)
      || EventSummaryComponent.differentTimeZone(datesWithOffset.endDateTime, datesWithOffset.endTimeZoneOffset);
  }

  private static differentTimeZone(serverTs: number, serverOffset: number): boolean {
    // client:
    //    The time-zone offset is the difference, in minutes, from local time to UTC.
    //    Note that this means that the offset is positive if the local timezone is behind UTC and negative if it is ahead.
    //    source: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/getTimezoneOffset
    //
    // server:
    //    nothing special, the offset is returned as it should be (positive if ahead of UTC, negative otherwise), in seconds

    const clientOffset = new Date(serverTs).getTimezoneOffset() * 60;
    return (clientOffset + serverOffset) !== 0; // client offset is negative if the current time is ahe
  }

}
