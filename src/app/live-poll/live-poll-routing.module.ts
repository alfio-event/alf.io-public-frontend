import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivePollComponent } from './live-poll.component';
import { LivePollService } from './shared/live-poll.service';

const routes: Routes = [{ path: '', component: LivePollComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [LivePollService]
})
export class LivePollRoutingModule { }
