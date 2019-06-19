import { Injectable } from '@angular/core';
import { AnalyticsConfiguration } from '../model/analytics-configuration';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  constructor() { }

  pageView(conf: AnalyticsConfiguration): void {
    console.log('page view', conf);
  }
}
