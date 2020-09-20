import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../shared/event.service';
import { LivePollService } from './shared/live-poll.service';
import { from } from 'rxjs';

@Component({
  selector: 'app-live-poll',
  templateUrl: './live-poll.component.html',
  styleUrls: ['./live-poll.component.scss']
})
export class LivePollComponent implements OnInit {

  pinForm: FormGroup;

  constructor(private route: ActivatedRoute, private eventService: EventService, private livePollService: LivePollService, private fb: FormBuilder) { }

  ngOnInit(): void {
    this.pinForm = this.fb.group({pin: null});
    this.route.params.subscribe(params => {
      let eventShortName = params['eventShortName'];
      this.eventService.getEvent(eventShortName).subscribe(ev => {
        //this.i18nService.setPageTitle('reservation-page-not-found.header.title', ev.displayName);
        console.log(ev);
      });
    });
  }

  confirmPin() {
    console.log('confirm pin');
  }

}
