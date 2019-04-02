import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../model/event';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss']
})
export class EventHeaderComponent implements OnInit {

  @Input()
  event: Event;

  constructor(private translate: TranslateService) { }

  ngOnInit() {
  }

  public changeLanguage(lang: string): void {
    this.translate.use(lang);
  }

}
