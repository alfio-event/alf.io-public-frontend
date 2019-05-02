import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ContentLanguage } from '../model/event';
import { LocalizedCountry } from '../model/localized-country';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private http: HttpClient) { }


  getCountries(locale: string): Observable<LocalizedCountry[]> {
      return this.http.get<LocalizedCountry[]>(`/api/v2/public/i18n/countries/${locale}`);
  }

  getAvailableLanguages(): Observable<ContentLanguage[]> {
    return this.http.get<ContentLanguage[]>(`/api/v2/public/i18n/languages`);
  }
}
