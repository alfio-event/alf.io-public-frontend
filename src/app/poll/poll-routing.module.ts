import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PollComponent } from './poll.component';
import { PollService } from './shared/poll.service';

const routes: Routes = [{ path: '', component: PollComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [PollService]
})
export class PollRoutingModule { }
