import { Component, Input } from '@angular/core';
import { PurchaseContext } from '../model/purchase-context';

@Component({
    selector: 'app-event-footer-links',
    templateUrl: './event-footer-links.component.html'
})
export class EventFooterLinksComponent {
    @Input()
    event: PurchaseContext;
}
