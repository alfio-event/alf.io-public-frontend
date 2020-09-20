import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../shared/poll.service';
import { combineLatest } from 'rxjs';
import { PollWithOptions } from '../model/poll-with-options';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-display-poll',
  templateUrl: './display-poll.component.html',
  styleUrls: ['./display-poll.component.scss']
})
export class DisplayPollComponent implements OnInit {


  eventShortName: string;
  pollId: number;
  pin: string;
  poll: PollWithOptions;

  constructor(
    private route: ActivatedRoute,
    public translate: TranslateService,
    private pollService: PollService) { }

  ngOnInit(): void {
    combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, query]) => {
      this.eventShortName = params['eventShortName'];
      this.pollId = parseInt(params['pollId']);
      this.pin = query['pin'];
      this.loadPoll()
    });
  }


  loadPoll() {
    this.pollService.getPoll(this.eventShortName, this.pollId, this.pin).subscribe(res => {
      if (res.success) {
        this.poll = res.value;
      }
    })
  }
}
