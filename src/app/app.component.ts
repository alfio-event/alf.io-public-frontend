import { Component, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnDestroy {

  private langChangeSub : Subscription;

  constructor(translate: TranslateService) {
    translate.setDefaultLang('en');
    translate.use('en');

    this.langChangeSub = translate.onLangChange.subscribe(langChange => {
      document.getElementsByTagName("html")[0].setAttribute('lang', langChange.lang);
    });
  }

  public ngOnDestroy(): void {
    this.langChangeSub.unsubscribe();
  }
}
