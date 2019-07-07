import { Component, Input } from '@angular/core';
import { Language } from '../model/event';
import { Router } from '@angular/router';
import { I18nService } from '../shared/i18n.service';

@Component({
  selector: 'app-language-selector',
  templateUrl: './language-selector.component.html',
  styleUrls: ['./language-selector.component.scss']
})
export class LanguageSelectorComponent {

  @Input()
  contentLanguages: Language[];

  constructor(private i18nService: I18nService, private router: Router) { }

  public changeLanguage(lang: string): void {
    const eventShortName = this.router.routerState.snapshot.root.firstChild ? this.router.routerState.snapshot.root.firstChild.params['eventShortName'] : null;
    this.i18nService.useTranslation(eventShortName, lang).subscribe(r => {});
  }
}
