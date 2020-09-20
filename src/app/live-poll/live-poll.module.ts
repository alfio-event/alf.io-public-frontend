import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LivePollRoutingModule } from './live-poll-routing.module';
import { LivePollComponent } from './live-poll.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [LivePollComponent],
  imports: [
    CommonModule,
    LivePollRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class LivePollModule { }
