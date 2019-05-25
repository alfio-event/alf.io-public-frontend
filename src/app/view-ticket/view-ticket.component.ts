import { Component, OnInit, OnDestroy } from '@angular/core';
import { Event } from '../model/event';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../shared/event.service';
import { TicketService } from '../shared/ticket.service';
import { TicketInfo } from '../model/ticket-info';
import { zip, Subscription } from 'rxjs';
import { I18nService } from '../shared/i18n.service';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html'
})
export class ViewTicketComponent implements OnInit, OnDestroy {

  event: Event;
  ticketIdentifier: string;
  ticketInfo: TicketInfo;

  private titleSub: Subscription;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private eventService: EventService,
    private i18nService: I18nService) { }

  public ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.ticketIdentifier = params['ticketId'];

      const eventShortName = params['eventShortName'];

      zip(this.eventService.getEvent(eventShortName), this.ticketService.getTicketInfo(eventShortName, this.ticketIdentifier)).subscribe( ([event, ticketInfo]) => {
        this.event = event;
        this.ticketInfo = ticketInfo;
        this.titleSub = this.i18nService.setPageTitle('show-ticket.header.title', event.displayName);
      })
      
      //TODO: add navigation here if the route does not correspond!
    });
  }

  public ngOnDestroy(): void {
    this.i18nService.unsetPageTitle(this.titleSub);
  }

}
