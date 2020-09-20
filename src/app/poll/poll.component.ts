import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { EventService } from '../shared/event.service';
import { PollService } from './shared/poll.service';
import { Poll } from './model/poll';
import { combineLatest } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Event } from '../model/event';

@Component({
  selector: 'app-live-poll',
  templateUrl: './poll.component.html',
  styleUrls: ['./poll.component.scss']
})
export class PollComponent implements OnInit {

  pinForm: FormGroup;
  polls: Poll[];
  eventShortName: string;
  event: Event

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private eventService: EventService,
    private pollService: PollService, 
    public translate: TranslateService,
    private fb: FormBuilder) { }

  ngOnInit(): void {
    this.pinForm = this.fb.group({pin: null});
    combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, query]) => {
      this.eventShortName = params['eventShortName'];
      console.log(query);
      if (query['pin']) {
        this.loadPolls(this.eventShortName, query['pin']);
      }

      this.eventService.getEvent(this.eventShortName).subscribe(ev => {
        //this.i18nService.setPageTitle('reservation-page-not-found.header.title', ev.displayName);
        this.event = ev;
      });
    });
  }

  private loadPolls(eventShortName: string, pin: string) {
    this.pollService.getAllPolls(eventShortName, pin).subscribe(res => {
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
    this.loadPolls(this.eventShortName, pin);
  }

}
