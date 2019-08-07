import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { I18nService } from './shared/i18n.service';
import { EventService } from './shared/event.service';
import { TranslateService } from '@ngx-translate/core';
import { map, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate {


  //

  constructor(private i18nService: I18nService, private eventService: EventService, private translate: TranslateService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const langQueryParam = next.queryParams['lang'];
    const persisted = this.i18nService.getPersistedLanguage();

    //set before calling, to avoid any strange flashes
    if (persisted && this.translate.currentLang != persisted) {
      this.translate.use(persisted);
    }
    
    const eventShortName = next.params['eventShortName'];
    const req = eventShortName ? this.getForEvent(eventShortName) : this.getForApp();

    return req.pipe(switchMap(availableLanguages => {
      const lang = this.extractLang(availableLanguages, persisted, langQueryParam);
      return this.i18nService.useTranslation(eventShortName, lang);
    }))
  }

  private getForEvent(eventShortName: string): Observable<string[]> {
    return this.eventService.getAvailableLanguageForEvent(eventShortName);
  }

  private getForApp(): Observable<string[]> {
    return this.i18nService.getAvailableLanguages().pipe(map(languages => languages.map(l => l.locale)));
  }

  private extractLang(availableLanguages: string[], persisted: string, override: string): string {
    var lang;
    if (override && availableLanguages.indexOf(override) >= 0) {
      lang = override;
    } else if (availableLanguages.indexOf(persisted) >= 0) {
      lang = persisted;
    } else if (availableLanguages.indexOf(this.translate.getBrowserLang()) >= 0) {
      lang = this.translate.getBrowserLang();
    } else {
      lang = availableLanguages[0];
    }
    return lang;
  }

}
