import { Component, OnInit } from '@angular/core';
import { UntypedFormGroup, UntypedFormBuilder } from '@angular/forms';
import { Poll } from '../model/poll';
import { ActivatedRoute, Router } from '@angular/router';
import { PollService } from '../shared/poll.service';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest } from 'rxjs';
import { handleServerSideValidationError } from '../../shared/validation-helper';
import { ErrorDescriptor } from '../../model/validated-response';

@Component({
  selector: 'app-poll-selection',
  templateUrl: './poll-selection.component.html',
  styleUrls: ['./poll-selection.component.scss']
})
export class PollSelectionComponent implements OnInit {

  pinForm: UntypedFormGroup;
  polls: Poll[];
  eventShortName: string;
  globalErrors: ErrorDescriptor[];

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private pollService: PollService, 
    public translate: TranslateService,
    private fb: UntypedFormBuilder) { }

  ngOnInit(): void {
    this.pinForm = this.fb.group({pin: null});
    combineLatest([this.route.params, this.route.queryParams]).subscribe(([params, query]) => {
      this.eventShortName = params['eventShortName'];
      if (query['pin']) {
        this.loadPolls(this.eventShortName, query['pin']);
      }
    });
  }

  private loadPolls(eventShortName: string, pin: string) {
    this.pollService.getAllPolls(eventShortName, pin).subscribe(res => {
      if (res.success) {
        this.router.navigate([], {queryParamsHandling: 'merge', queryParams: {pin: pin}});
        this.polls = res.value;
        if (this.polls.length === 1) {
          this.router.navigate([this.polls[0].id], {relativeTo: this.route, queryParamsHandling: 'merge', queryParams: {pin: pin}});
        }
      }
    }, (err) => {
      this.globalErrors = handleServerSideValidationError(err, this.pinForm);
    });
  }

  confirmPin() {
    const pin = this.pinForm.value.pin;
    this.loadPolls(this.eventShortName, pin);
  }

}
