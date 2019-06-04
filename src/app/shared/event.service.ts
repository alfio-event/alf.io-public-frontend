import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { BasicEventInfo } from '../model/basic-event-info'
import { Event } from '../model/event'
import { ItemsByCategory } from '../model/items-by-category';
import { WaitingListSubscriptionRequest } from '../model/waiting-list-subscription-request';
import { ValidatedResponse } from '../model/validated-response';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  constructor(private http: HttpClient) { }

  getEvents() : Observable<BasicEventInfo[]> {
    return this.http.get<BasicEventInfo[]>('/api/v2/public/events');
  }

  getEvent(eventShortName: string): Observable<Event> {
    return this.http.get<Event>(`/api/v2/public/event/${eventShortName}`);
  }

  getEventTicketsInfo(eventShortName: string) : Observable<ItemsByCategory> {
    return this.http.get<ItemsByCategory>(`/api/v2/public/event/${eventShortName}/ticket-categories`);
  }

  getAvailableLanguageForEvent(eventShortName: string): Observable<string[]> {
    return this.http.get<string[]>(`/api/v2/public/event/${eventShortName}/languages`);
  }

  submitWaitingListSubscriptionRequest(eventShortName: string, waitingListSubscriptionRequest: WaitingListSubscriptionRequest): Observable<ValidatedResponse<boolean>> {
    return this.http.post<ValidatedResponse<boolean>>(`/api/v2/public/event/${eventShortName}/waiting-list/subscribe`, waitingListSubscriptionRequest);
  }

  validateCode(eventShortName: string, code: string): Observable<ValidatedResponse<boolean>> {
    return this.http.get<ValidatedResponse<boolean>>(`/api/v2/public/event/${eventShortName}/validate-code`, {params: {code: code}});
  }
}
