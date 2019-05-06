import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { Info } from '../model/info';

@Injectable({
  providedIn: 'root'
})
export class InfoService {
  constructor(private http: HttpClient) { }


  getInfo(): Observable<Info> {
      return this.http.get<Info>(`/api/v2/info`);
  }
}
