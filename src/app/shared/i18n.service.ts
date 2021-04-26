import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, zip } from 'rxjs';
import { Language } from '../model/event';
import { LocalizedCountry } from '../model/localized-country';
import { Title } from '@angular/platform-browser';
import {TranslateService, TranslateLoader, LangChangeEvent} from '@ngx-translate/core';
import { Router, NavigationStart } from '@angular/router';
import { map, mergeMap, shareReplay, catchError, share } from 'rxjs/operators';
import { EventService } from './event.service';
import { PurchaseContextType } from './purchase-context.service';
import { PurchaseContext} from '../model/purchase-context';
import { TranslocoHttpLoader } from '../transloco/transloco-root.module';
import { TranslocoService } from '@ngneat/transloco';
import { ThrowStmt } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class I18nService {


  private applicationLanguages: Observable<Language[]>;

  private static getInterpolateParams(lang: string, ctx: PurchaseContext): any {
    if (ctx != null) {
      return {'0': ctx.title[lang]};
    }
    return null;
  }

  constructor(
    private http: HttpClient,
    private title: Title,
    private translateService: TranslateService,
    private translocoService: TranslocoService,
    private router: Router,
    private customLoader: CustomLoader,
    private translocoHttpLoader: TranslocoHttpLoader,
    private eventService: EventService) { }

  getCountries(locale: string): Observable<LocalizedCountry[]> {
    return this.http.get<LocalizedCountry[]>(`/api/v2/public/i18n/countries/${locale}`);
  }

  getVatCountries(locale: string): Observable<LocalizedCountry[]> {
    return this.http.get<LocalizedCountry[]>(`/api/v2/public/i18n/countries-vat/${locale}`);
  }

  getEUVatCountries(locale: string): Observable<LocalizedCountry[]> {
    return this.http.get<LocalizedCountry[]>(`/api/v2/public/i18n/eu-countries-vat/${locale}`);
  }

  getAvailableLanguages(): Observable<Language[]> {
    if (!this.applicationLanguages) {
      this.applicationLanguages = this.http.get<Language[]>(`/api/v2/public/i18n/languages`).pipe(shareReplay(1));
    }
    return this.applicationLanguages;
  }

  setPageTitle(titleCode: string, ctx?: PurchaseContext): void {

    const titleSub = this.translateService.onLangChange.subscribe((params: LangChangeEvent) => {
      this.title.setTitle(this.translateService.instant(titleCode, I18nService.getInterpolateParams(params.lang, ctx)));
    });

    const routerSub = this.router.events.subscribe(ev => {
      if (ev instanceof NavigationStart) {
        routerSub.unsubscribe();
        titleSub.unsubscribe();
        this.title.setTitle(null);
      }
    });

    this.title.setTitle(this.translateService.instant(titleCode, I18nService.getInterpolateParams(this.translateService.currentLang, ctx)));
  }

  persistLanguage(lang: string): void {
    window.sessionStorage['ALFIO_LANG'] = lang;
  }

  getPersistedLanguage(): string {
    return window.sessionStorage['ALFIO_LANG'];
  }

  getCurrentLang(): string {
    return this.translateService.currentLang;
  }

  useTranslation(type: PurchaseContextType, publicIdentifier: string, lang: string): Observable<boolean> {
    const overrideBundle = this.getOverrideBundle(type, publicIdentifier, lang);
    return zip(this.customLoader.getTranslation(lang), overrideBundle).pipe(mergeMap(([root, override]) => {
      this.translateService.setTranslation(lang, root, false);
      this.translateService.setTranslation(lang, override, true);
      this.translateService.use(lang);

      
      console.log(this.translocoService);
      this.translocoService.setActiveLang(lang);
      this.translocoService.setTranslation(root, lang);
      console.log('override is', override);
      console.log('before override', this.translocoService.translate('ticket.event-info', {}));
      this.translocoService.setTranslation(override, lang, {merge: true, emitChange: true});
      this.translocoService.setActiveLang(lang);
      console.log('after override', this.translocoService.translate('ticket.event-info', {}));

      return of(true);
    }));
  }

  private getOverrideBundle(type: 'event' | 'subscription', publicIdentifier: string, lang: string): Observable<any> {
    if (type === 'event' && publicIdentifier) {
      return this.eventService.getEvent(publicIdentifier)
        .pipe(
          catchError(e => of({i18nOverride: {}})),
          map(e => e.i18nOverride[lang] || {})
        );
    }
    return of({});
  }
}

const translationCache: {[key: string]: Observable<any>} = {};

@Injectable({providedIn: 'root'})
export class CustomLoader implements TranslateLoader {

  constructor(private http: HttpClient) {
  }

  getTranslation(lang: string): Observable<any> {
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
