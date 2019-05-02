import { Component, Input } from '@angular/core';
import { ContentLanguage } from '../model/event';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {

  @Input()
  contentLanguages: ContentLanguage[];

  constructor(private translate: TranslateService) { }

  public changeLanguage(lang: string): void {
    this.translate.use(lang);
  }
}
