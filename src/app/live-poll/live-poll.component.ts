import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { EventService } from '../shared/event.service';

@Component({
  selector: 'app-live-poll',
  templateUrl: './live-poll.component.html',
  styleUrls: ['./live-poll.component.scss']
})
export class LivePollComponent implements OnInit {

  constructor(private route: ActivatedRoute, private eventService: EventService) { }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      let eventShortName = params['eventShortName'];
      this.eventService.getEvent(eventShortName).subscribe(ev => {
        //this.i18nService.setPageTitle('reservation-page-not-found.header.title', ev.displayName);
        console.log(ev);
      });
    });
  }

}
