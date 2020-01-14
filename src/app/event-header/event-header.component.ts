import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../model/event';
import { I18nService } from '../shared/i18n.service';

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss']
})
export class EventHeaderComponent implements OnInit, OnDestroy {

  @Input()
  event: Event;

  schemaElem: HTMLScriptElement;

  constructor(private i18nService: I18nService) {
  }

  ngOnInit() {
    // https://developers.google.com/search/docs/data-types/event
    // https://search.google.com/test/rich-results?utm_campaign=devsite&utm_medium=jsonld&utm_source=event&id=tqxuXf4XIb4xolzr7EiE2Q

    const start = new Date(this.event.datesWithOffset.startDateTime);
    const end = new Date(this.event.datesWithOffset.endDateTime);
    const descriptionHolder = document.createElement('div');
    descriptionHolder.innerHTML = this.event.description[this.i18nService.getCurrentLang()];

    let jsonSchema = {
      "@context": "https://schema.org",
      "@type": "Event",
      "name" : this.event.displayName,
      "startDate": start.toISOString(),
      "endDate": end.toISOString(),
      "description": descriptionHolder.innerText.trim(),
      "location": {
        "@type": "Place",
        "address": this.event.location
      },
      "organizer": {
        "@type": "Organization",
        "name": this.event.organizationName,
        "email": this.event.organizationEmail
      },
      "image": '/file/'+this.event.fileBlobId
    };

    this.schemaElem = document.createElement('script');
    this.schemaElem.text = JSON.stringify(jsonSchema);
    this.schemaElem.type = 'application/ld+json';
    document.head.appendChild(this.schemaElem);
  }

  ngOnDestroy() {
    this.schemaElem.remove();
  }
}
