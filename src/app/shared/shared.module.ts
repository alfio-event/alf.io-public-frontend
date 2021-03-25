import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { EventHeaderComponent } from './event-header/event-header.component';
import { InvalidFeedbackDirective } from './invalid-feedback.directive';
import {WarningModalComponent} from './warning-modal/warning-modal.component';


@NgModule({
  declarations: [ LanguageSelectorComponent, EventHeaderComponent, InvalidFeedbackDirective, WarningModalComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    NgbDropdownModule
  ],
  exports: [LanguageSelectorComponent, EventHeaderComponent, InvalidFeedbackDirective, WarningModalComponent],
})
export class SharedModule { }
