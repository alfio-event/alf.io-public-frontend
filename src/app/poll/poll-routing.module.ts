import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollComponent } from './poll.component';
import { PollService } from './shared/poll.service';
import { DisplayPollComponent } from './display-poll/display-poll.component';

const routes: Routes = [
  { path: '', component: PollComponent },
  { path: ':pollId', component: DisplayPollComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PollService]
})
export class PollRoutingModule { }
