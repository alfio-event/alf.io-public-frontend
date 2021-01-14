import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { I18nService } from '../../shared/i18n.service';
import { removeDOMNode } from '../../shared/event.service';
import { PurchaseContext } from 'src/app/model/purchase-context';
import { Event } from 'src/app/model/event';
import { PurchaseContextType } from '../purchase-context.service';

@Component({
  selector: 'app-event-header',
  templateUrl: './event-header.component.html',
  styleUrls: ['./event-header.component.scss']
})
export class EventHeaderComponent implements OnInit, OnDestroy {

  @Input()
  purchaseContext: PurchaseContext;

  @Input()
  type: PurchaseContextType;

  schemaElem: HTMLScriptElement;

  constructor(private i18nService: I18nService) {
  }

  ngOnInit() {
    // https://developers.google.com/search/docs/data-types/event
    // https://search.google.com/test/rich-results?utm_campaign=devsite&utm_medium=jsonld&utm_source=event&id=tqxuXf4XIb4xolzr7EiE2Q

    if (this.type === 'event') {

      let ev = this.purchaseContext as Event;
      const start = new Date(ev.datesWithOffset.startDateTime);
      const end = new Date(ev.datesWithOffset.endDateTime);
      const descriptionHolder = document.createElement('div');
      descriptionHolder.innerHTML = ev.description[this.i18nService.getCurrentLang()];

      const jsonSchema = {
        '@context': 'https://schema.org',
        '@type': 'Event',
        'name' : ev.displayName,
        'startDate': start.toISOString(),
        'endDate': end.toISOString(),
        'description': descriptionHolder.innerText.trim(),
        'location': {
          '@type': 'Place',
          'address': ev.location
        },
        'organizer': {
          '@type': 'Organization',
          'name': ev.organizationName,
          'email': ev.organizationEmail
        },
        'image': '/file/' + ev.fileBlobId
      };

      this.schemaElem = document.createElement('script');
      this.schemaElem.text = JSON.stringify(jsonSchema);
      this.schemaElem.type = 'application/ld+json';
      document.head.appendChild(this.schemaElem);
    }
  }

  ngOnDestroy() {
    if(this.type == 'event') {
      removeDOMNode(this.schemaElem);
    }
  }
}
