import { Injectable } from '@angular/core';
import { AnalyticsConfiguration } from '../model/analytics-configuration';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {

  private gaScript: Observable<[Function, AnalyticsConfiguration, string]> = null;

  constructor() {
  }

  pageView(conf: AnalyticsConfiguration): void {
    const locationPathName = location.pathname;
    const documentTitle = document.title;
    if (conf.googleAnalyticsKey) {
      this.handleGoogleAnalytics(conf, locationPathName, documentTitle);
    }
  }


  private handleGoogleAnalytics(conf: AnalyticsConfiguration, locationPathName: string, documentTitle: string) {
    if (this.gaScript === null) {
      this.gaScript = new Observable<[Function, AnalyticsConfiguration, string]>(subscribe => {
        if (!document.getElementById('GA_SCRIPT')) { // <- script is not created
          const scriptElem = document.createElement('script');
          scriptElem.id = 'GA_SCRIPT';
          scriptElem.addEventListener('load', () => {
            subscribe.next([this.initGtag(conf), conf, locationPathName]);
          });
          scriptElem.src = `https://www.googletagmanager.com/gtag/js?id=${conf.googleAnalyticsKey}`;
          scriptElem.async = true;
          document.head.appendChild(scriptElem);
        } else if (!window['gtag']) { // <- script has been created, but not loaded
          document.getElementById('GA_SCRIPT').addEventListener('load', () => {
            subscribe.next([this.initGtag(conf), conf, locationPathName]);
          });
        } else { // <- script has been loaded
          subscribe.next([window['gtag'], conf, locationPathName]);
        }
      });
    }

    this.gaScript.subscribe(([gtag, configuration, pathname]) => {
      gtag('config', configuration.googleAnalyticsKey, { 'page_title': documentTitle, 'page_path': pathname });
    });
  }

  private initGtag(configuration: AnalyticsConfiguration): any {
    window['dataLayer'] = window['dataLayer'] || [];
    window['dataLayer'].push(['js', new Date()]);
    window['dataLayer'].push(['config', configuration.googleAnalyticsKey]);
    window['gtag'] = window['gtag'] || function () {
      window['dataLayer'].push(arguments as any);
    };
    return window['gtag'];
  }
}
