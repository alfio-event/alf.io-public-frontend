import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PollRoutingModule } from './poll-routing.module';
import { PollComponent } from './poll.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DisplayPollComponent } from './display-poll/display-poll.component';
import { TranslateModule } from '@ngx-translate/core'


@NgModule({
  declarations: [PollComponent, DisplayPollComponent],
  imports: [
    TranslateModule.forChild(),
    CommonModule,
    PollRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ]
})
export class PollModule { }
