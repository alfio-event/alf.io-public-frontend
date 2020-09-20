import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollRoutingModule } from './poll-routing.module';
import { PollComponent } from './poll.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayPollComponent } from './display-poll/display-poll.component';


@NgModule({
  declarations: [PollComponent, DisplayPollComponent],
  imports: [
    CommonModule,
    PollRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PollModule { }
