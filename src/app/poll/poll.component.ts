import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../shared/event.service';
import { PollService } from './shared/poll.service';
import { Poll } from './model/poll';

@Component({
  selector: 'app-live-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  pinForm: FormGroup;
  polls: Poll[];

  constructor(private route: ActivatedRoute, private eventService: EventService, private pollService: PollService, private fb: FormBuilder) { }

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
    this.pollService.getAllPolls(this.route.snapshot.params['eventShortName'], this.pinForm.value.pin).subscribe(res => {
      if (res.success) {
        this.polls = res.value;
      }
    });
  }

}
