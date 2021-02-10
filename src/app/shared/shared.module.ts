import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';

import { LanguageSelectorComponent } from './language-selector/language-selector.component';
import { PurchaseContextHeaderComponent } from './event-header/purchase-context-header.component';
import { InvalidFeedbackDirective } from './invalid-feedback.directive';


@NgModule({
  declarations: [ LanguageSelectorComponent, PurchaseContextHeaderComponent, InvalidFeedbackDirective],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    NgbDropdownModule
  ],
  exports: [LanguageSelectorComponent, PurchaseContextHeaderComponent, InvalidFeedbackDirective],
})
export class SharedModule { }
