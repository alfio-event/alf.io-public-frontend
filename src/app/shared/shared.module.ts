import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {NgbDropdownModule, NgbToastModule} from '@ng-bootstrap/ng-bootstrap';

import {LanguageSelectorComponent} from './language-selector/language-selector.component';
import {PurchaseContextHeaderComponent} from './event-header/purchase-context-header.component';
import {InvalidFeedbackDirective} from './invalid-feedback.directive';
import {ClipboardCopyDirective} from './clipboard-copy/clipboard-copy.directive';
import {FeedbackComponent} from './feedback/feedback.component';
import {WarningModalComponent} from './warning-modal/warning-modal.component';

@NgModule({
  declarations: [ LanguageSelectorComponent, PurchaseContextHeaderComponent, InvalidFeedbackDirective, ClipboardCopyDirective, FeedbackComponent, WarningModalComponent],
  imports: [
    CommonModule,
    TranslateModule.forChild(),
    FontAwesomeModule,
    NgbDropdownModule,
    NgbToastModule
  ],
  exports: [LanguageSelectorComponent, PurchaseContextHeaderComponent, InvalidFeedbackDirective, ClipboardCopyDirective, FeedbackComponent, WarningModalComponent],
})
export class SharedModule { }
