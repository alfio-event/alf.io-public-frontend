import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LivePollComponent } from './live-poll.component';

const routes: Routes = [{ path: '', component: LivePollComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LivePollRoutingModule { }
