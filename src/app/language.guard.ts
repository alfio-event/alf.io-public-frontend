import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { I18nService } from './shared/i18n.service';
import { EventService } from './shared/event.service';
import { TranslateService } from '@ngx-translate/core';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate {

  constructor(private i18nService: I18nService, private eventService: EventService, private translate: TranslateService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const persisted = this.i18nService.getPersistedLanguage();

    //set before calling, to avoid any strange flashes
    if (persisted) {
      this.translate.use(persisted);
    }
    
    const eventShortName = next.params['eventShortName'];
    const req = eventShortName ? this.eventService.getAvailableLanguageForEvent(eventShortName) : this.i18nService.getAvailableLanguages().pipe(map(languages => languages.map(l => l.locale)));

    return req.pipe(map(availableLanguages => {
      this.useLanguage(availableLanguages, persisted);
      return true;
    }));
  }

  private useLanguage(availableLanguages: string[], persisted: string): void {
    if (availableLanguages.indexOf(persisted) >= 0) {
      this.translate.use(persisted);
    } else if (availableLanguages.indexOf(this.translate.getBrowserLang()) >= 0) {
      this.translate.use(this.translate.getBrowserLang());
    } else {
      this.translate.use(availableLanguages[0]);
    }
  }

}
