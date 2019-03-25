import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public getEvents() : Observable<any> {
    return this.http.get('/api/v2/public/events');
  }


  public getEvent(eventShortName: string) : Observable<any> {
    return this.http.get(`/api/v2/public/event/${eventShortName}`);
  }
}
