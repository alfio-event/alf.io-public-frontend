import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Language } from '../model/event';
import { LocalizedCountry } from '../model/localized-country';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private http: HttpClient) { }


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
}
