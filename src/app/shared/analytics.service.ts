import { Injectable } from '@angular/core';
import { AnalyticsConfiguration } from '../model/analytics-configuration';
import { Observable } from 'rxjs';

const initAttribute = 'data-alfio-init-complete';

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
        const script = document.getElementById('GA_SCRIPT');
        if (script == null) { // <- script is not created
          const scriptElem = document.createElement('script');
          scriptElem.id = 'GA_SCRIPT';
          scriptElem.addEventListener('load', () => {
            subscribe.next([this.initGtag(conf, scriptElem), conf, locationPathName]);
          });
          scriptElem.src = `https://www.googletagmanager.com/gtag/js?id=${conf.googleAnalyticsKey}`;
          scriptElem.async = true;
          document.head.appendChild(scriptElem);
        } else if (script.getAttribute(initAttribute) == null) { // <- script has been created, but not loaded
          subscribe.next([this.initGtag(conf, script), conf, locationPathName]);
        } else { // <- script has been loaded
          subscribe.next([window['gtag'], conf, locationPathName]);
        }
      });
    }

    this.gaScript.subscribe(([gtag, config, pathname]) => {
      console.log('calling gtag for url', pathname);
      gtag('config', config.googleAnalyticsKey, { 'page_path': pathname });
    });
  }

  private initGtag(configuration: AnalyticsConfiguration, script: HTMLElement): any {
    console.log('init gtag', configuration.googleAnalyticsKey);
    window['dataLayer'] = window['dataLayer'] || [];
    window['gtag'] = window['gtag'] || function () {
      window['dataLayer'].push(arguments as any);
    };
    window['gtag']('js', new Date());
    window['gtag']('config', configuration.googleAnalyticsKey);
    script.setAttribute(initAttribute, 'true');
    return window['gtag'];
  }
}
