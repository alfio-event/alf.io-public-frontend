import { Component, OnInit } from '@angular/core';
import { Event } from '../model/event';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../shared/event.service';
import { TicketService } from '../shared/ticket.service';

@Component({
  selector: 'app-view-ticket',
  templateUrl: './view-ticket.component.html',
  styleUrls: ['./view-ticket.component.scss']
})
export class ViewTicketComponent implements OnInit {

  event: Event;
  ticketIdentifier: string;
  ticketInfo: any;

  constructor(
    private ticketService: TicketService,
    private route: ActivatedRoute,
    private eventService: EventService) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.ticketIdentifier = params['ticketId'];

      this.eventService.getEvent(params['eventShortName']).subscribe(event => {
        this.event = event;
      });

      this.ticketService.getTicketInfo(params['eventShortName'], this.ticketIdentifier).subscribe(ticketInfo => {
        this.ticketInfo = ticketInfo;
      });

      //TODO: add navigation here if the route does not correspond!
    });
  }

}
