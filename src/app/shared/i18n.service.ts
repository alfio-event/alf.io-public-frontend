import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Language } from '../model/event';
import { LocalizedCountry } from '../model/localized-country';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { Router, NavigationStart } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor(private http: HttpClient, private title: Title, private translateService: TranslateService, private router: Router) { }

  getCountries(locale: string): Observable<LocalizedCountry[]> {
      return this.http.get<LocalizedCountry[]>(`/api/v2/public/i18n/countries/${locale}`);
  }

  getVatCountries(locale: string): Observable<LocalizedCountry[]> {
    return this.http.get<LocalizedCountry[]>(`/api/v2/public/i18n/countries-vat/${locale}`);
  }

  getEUVatCountries(locale: string): Observable<LocalizedCountry[]> {
    return this.http.get<LocalizedCountry[]>(`/api/v2/public/i18n/eu-countries-vat/${locale}`);
  }

  getAvailableLanguages(): Observable<Language[]> {
    return this.http.get<Language[]>(`/api/v2/public/i18n/languages`);
  }

  setPageTitle(titleCode: string, eventName: string): void {

    let obs = this.translateService.stream(titleCode, {'0': eventName});

    let titleSub =  obs.subscribe(res => {
      this.title.setTitle(res);
    });

    let routerSub = this.router.events.subscribe(ev => {
      if(ev instanceof NavigationStart) {
        routerSub.unsubscribe();
        titleSub.unsubscribe();
        this.title.setTitle(null);
      }
    });
  }
}
