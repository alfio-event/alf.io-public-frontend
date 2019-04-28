import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { BasicEventInfo } from '../model/basic-event-info'
import { Event } from '../model/event'
import { TicketCategory } from '../model/ticket-category'

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  public getEvents() : Observable<BasicEventInfo[]> {
    return this.http.get<BasicEventInfo[]>('/api/v2/public/events');
  }

  public getEvent(eventShortName: string): Observable<Event> {
    return this.http.get<Event>(`/api/v2/public/event/${eventShortName}`);
  }

  public getEventTicketsInfo(eventShortName: string) : Observable<TicketCategory[]> {
    return this.http.get<TicketCategory[]>(`/api/v2/public/event/${eventShortName}/ticket-categories`);
  }
}
