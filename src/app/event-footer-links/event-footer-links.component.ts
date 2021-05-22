import { Component, Input } from '@angular/core';
import { TermsPrivacyLinksContainer } from '../model/event';

@Component({
    selector: 'app-event-footer-links',
    templateUrl: './event-footer-links.component.html'
})
export class EventFooterLinksComponent {
    @Input()
    linksContainer: TermsPrivacyLinksContainer;
}
