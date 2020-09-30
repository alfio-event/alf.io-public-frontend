import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { EventHeaderComponent } from './event-header/event-header.component';


@NgModule({
  declarations: [ LanguageSelectorComponent, EventHeaderComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    NgbDropdownModule
  ],
  exports: [LanguageSelectorComponent, EventHeaderComponent],
})
export class SharedModule { }
