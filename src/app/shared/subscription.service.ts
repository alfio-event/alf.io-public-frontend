import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicSubscriptionInfo } from '../model/subscription';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  getSubscriptions(): Observable<BasicSubscriptionInfo[]> {
    return this.http.get<BasicSubscriptionInfo[]>('/api/v2/public/subscriptions');
  }

  getSubscriptionById(id: string): Observable<BasicSubscriptionInfo> {
    return this.http.get<BasicSubscriptionInfo>(`/api/v2/public/subscription/${id}`);
  }
}
