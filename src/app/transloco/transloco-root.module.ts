import { HttpClient } from '@angular/common/http';
import {
  TRANSLOCO_LOADER,

  TranslocoLoader,
  TRANSLOCO_CONFIG,
  translocoConfig,
  TranslocoModule
} from '@ngneat/transloco';
import { Injectable, NgModule } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable, of } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

const translationCache: {[key: string]: Observable<any>} = {};

@Injectable({ providedIn: 'root' })
export class TranslocoHttpLoader implements TranslocoLoader {
  constructor(private http: HttpClient) {}

  getTranslation(lang: string) {
    if (!translationCache[lang]) {
      const preloadBundle = document.getElementById('preload-bundle');
      if (preloadBundle && preloadBundle.getAttribute('data-param') === lang) {
        translationCache[lang] = of(JSON.parse(preloadBundle.textContent)).pipe(shareReplay(1));
      } else {
        translationCache[lang] = this.http.get(`/api/v2/public/i18n/bundle/${lang}`).pipe(shareReplay(1));
      }
    }
    return translationCache[lang];
  }
}

@NgModule({
  exports: [ TranslocoModule ],
  providers: [
    {
      provide: TRANSLOCO_CONFIG,
      useValue: translocoConfig({
        defaultLang: 'en',
        availableLangs: ['en', 'de', 'fr', 'it'],
        // Remove this option if your application doesn't support changing language in runtime.
        reRenderOnLangChange: true,
        prodMode: environment.production,
      })
    },
    { provide: TRANSLOCO_LOADER, useClass: TranslocoHttpLoader }
  ]
})
export class TranslocoRootModule {}
