import { Component, Input } from '@angular/core';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-event-summary',
  templateUrl: './event-summary.component.html'
})
export class EventSummaryComponent {

  @Input()
  event: Event;

  constructor(private translate: TranslateService) { }

}
