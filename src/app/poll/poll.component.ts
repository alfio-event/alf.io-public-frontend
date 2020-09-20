import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private eventService: EventService, 
    private pollService: PollService, 
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.pinForm = this.fb.group({pin: null});
    this.route.params.subscribe(params => {
      let eventShortName = params['eventShortName'];

      if (this.route.snapshot.queryParams['pin']) {
        this.loadPolls(this.route.snapshot.queryParams['pin']);
      }

      this.eventService.getEvent(eventShortName).subscribe(ev => {
        //this.i18nService.setPageTitle('reservation-page-not-found.header.title', ev.displayName);
        console.log(ev);
      });
    });
  }

  private loadPolls(pin: string) {
    this.pollService.getAllPolls(this.route.snapshot.params['eventShortName'], pin).subscribe(res => {
      if (res.success) {
        this.router.navigate([], {queryParamsHandling: 'merge', queryParams: {pin: pin}});
        this.polls = res.value;
        if (this.polls.length === 1) {
          this.router.navigate([this.polls[0].id], {relativeTo: this.route, queryParamsHandling: 'merge'});
        }
      }
    });
  }

  confirmPin() {
    const pin = this.pinForm.value.pin;
    this.loadPolls(pin)
  }

}
