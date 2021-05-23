import { Component, Input } from '@angular/core';
import { PurchaseContext } from '../model/purchase-context';
import {TermsPrivacyLinksContainer} from '../model/event';

@Component({
    selector: 'app-footer-links',
    templateUrl: './footer-links.component.html'
})
export class FooterLinksComponent {
    @Input()
    linksContainer: TermsPrivacyLinksContainer;
}
