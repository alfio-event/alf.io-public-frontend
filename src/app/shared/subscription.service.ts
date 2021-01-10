import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BasicSubscriptionInfo, SubscriptionInfo } from '../model/subscription';
import { ValidatedResponse } from '../model/validated-response';

@Injectable({
  providedIn: 'root'
})
export class SubscriptionService {

  constructor(private http: HttpClient) { }

  getSubscriptions(): Observable<BasicSubscriptionInfo[]> {
    return this.http.get<BasicSubscriptionInfo[]>('/api/v2/public/subscriptions');
  }

  getSubscriptionById(id: string): Observable<SubscriptionInfo> {
    return this.http.get<SubscriptionInfo>(`/api/v2/public/subscription/${id}`);
  }

  reserve(id: string): Observable<ValidatedResponse<string>> {
    return this.http.post<ValidatedResponse<string>>(`/api/v2/public/subscription/${id}`, {});
  }
}
