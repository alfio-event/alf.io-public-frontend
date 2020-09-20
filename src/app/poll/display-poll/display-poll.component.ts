import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PollService } from '../shared/poll.service';

@Component({
  selector: 'app-display-poll',
  templateUrl: './display-poll.component.html',
  styleUrls: ['./display-poll.component.scss']
})
export class DisplayPollComponent implements OnInit {

  constructor(
    private route: ActivatedRoute,
    private pollService: PollService) { }

  ngOnInit(): void {
  }

}
