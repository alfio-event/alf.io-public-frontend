import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { I18nService } from './shared/i18n.service';
import { EventService } from './shared/event.service';
import { TranslateService } from '@ngx-translate/core';
import { map, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate {

  //
  private applicationLanguages: string[];
  private eventLanguages: {[name:string]: string[]} = {};
  //

  constructor(private i18nService: I18nService, private eventService: EventService, private translate: TranslateService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    const persisted = this.i18nService.getPersistedLanguage();

    //set before calling, to avoid any strange flashes
    if (persisted) {
      this.translate.use(persisted);
    }
    
    const eventShortName = next.params['eventShortName'];
    const req = eventShortName ? this.getForEvent(eventShortName) : this.getForApp();

    return req.pipe(map(availableLanguages => {
      this.useLanguage(availableLanguages, persisted);
      return true;
    }));
  }

  private getForEvent(eventShortName: string): Observable<string[]> {
    if (this.eventLanguages[eventShortName]) {
      return of(this.eventLanguages[eventShortName]);
    } else {
      return this.eventService.getAvailableLanguageForEvent(eventShortName).pipe(tap(val => {this.eventLanguages[eventShortName] = val}));
    }
  }

  private getForApp(): Observable<string[]> {

    if (this.applicationLanguages) {
      return of(this.applicationLanguages);
    } else {
      return this.i18nService.getAvailableLanguages().pipe(map(languages => languages.map(l => l.locale)), tap(val => {this.applicationLanguages = val;}));
    }
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
