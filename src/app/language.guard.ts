import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { I18nService } from './shared/i18n.service';
import { EventService } from './shared/event.service';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageGuard implements CanActivate {

  constructor(private i18nService: I18nService, private eventService: EventService, private translate: TranslateService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    this.translate.setDefaultLang('en');

    let persisted = this.i18nService.getPersistedLanguage();


    const eventShortName = next.params['eventShortName'];
    if(eventShortName) {
      console.log('event short name is ', eventShortName);
    }


    if (persisted) {
      this.translate.use(persisted);
    } else {
      this.translate.use('en');
    }
    return true;
  }

}
