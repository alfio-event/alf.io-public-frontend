import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  constructor(private http: HttpClient) { }


  getCountries(locale: string): Observable<any> {
      return this.http.get(`/api/v2/public/i18n/countries/${locale}`);
  }
}
