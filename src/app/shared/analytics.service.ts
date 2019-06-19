import { Injectable } from '@angular/core';
import { AnalyticsConfiguration } from '../model/analytics-configuration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private gaScript: Observable<Function> = null;

  constructor() {
  }

  pageView(conf: AnalyticsConfiguration): void {
    if (conf.googleAnalyticsKey) {
      this.handleGoogleAnalytics(conf);
    }
  }


  private handleGoogleAnalytics(conf: AnalyticsConfiguration) {
    if(this.gaScript === null) {
      this.gaScript = new Observable<Function>(subscribe => {
        if(!document.getElementById('GA_SCRIPT')) { // <- script is not created
          const scriptElem = document.createElement('script');
          scriptElem.id = 'GA_SCRIPT'
          scriptElem.addEventListener('load', () => {subscribe.next(window['ga']);})
          scriptElem.src = 'https://ssl.google-analytics.com/analytics.js';
          scriptElem.async = true;
          scriptElem.defer = true;
          document.body.appendChild(scriptElem);
        } else if (!window['ga']) { //<- script has been created, but not loaded
          document.getElementById('GA_SCRIPT').addEventListener('load', () => {
            subscribe.next(window['ga']);
          });
        } else { //<- script has been loaded
          subscribe.next(window['ga']);
        }
      });
    }

    this.gaScript.subscribe(ga => {
      console.log('ga', ga);
    });
  }
}
