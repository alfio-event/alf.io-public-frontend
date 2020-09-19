import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LivePollRoutingModule } from './live-poll-routing.module';
import { LivePollComponent } from './live-poll.component';


@NgModule({
  declarations: [LivePollComponent],
  imports: [
    CommonModule,
    LivePollRoutingModule
  ]
})
export class LivePollModule { }
