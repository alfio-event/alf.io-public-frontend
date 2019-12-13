import { Component, Input } from '@angular/core';
import { Event } from '../model/event';

@Component({
    selector: 'app-event-footer-links',
    templateUrl: './event-footer-links.component.html'
})
export class EventFooterLinksComponent {
    @Input()
    event: Event;
}
