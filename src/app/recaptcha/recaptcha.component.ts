import { Component, OnInit, Input, ElementRef, OnDestroy, ViewChild, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';


declare const grecaptcha: any;

let idCallback = 0;

@Component({
  selector: 'app-recaptcha',
  templateUrl: './recaptcha.component.html'
})
export class RecaptchaComponent implements OnInit, OnDestroy {

  @Input()
  apiKey: string;

  private langSub: Subscription;

  @ViewChild('targetElement')
  private targetElement: ElementRef;

  @Output()
  recaptchaResponse: EventEmitter<string> = new EventEmitter<string>();

  constructor(private translate: TranslateService) { }

  ngOnInit() {

    if (!document.getElementById('recaptcha-api-script')) {
      const scriptElem = document.createElement('script');

      idCallback++;

      const callBackName = `onloadRecaptchaCallback${idCallback}`;

      scriptElem.src = `https://www.google.com/recaptcha/api.js?onload=${callBackName}&render=explicit`;
      scriptElem.id = 'recaptcha-api-script';
      scriptElem.async = true;
      scriptElem.defer = true;

      window[callBackName] = () => {
        this.enableRecaptcha();
      }
      document.body.appendChild(scriptElem);
    } else {
      this.enableRecaptcha();
    }

    this.langSub = this.translate.onLangChange.subscribe(change => {
      this.enableRecaptcha();
    })
  }

  ngOnDestroy() {
    if (this.langSub) {
      this.langSub.unsubscribe();
    }
    let elem = document.getElementById('recaptcha-api-script');
    if (elem) {
      elem.remove();
    }
  }

  enableRecaptcha() {

    // delete container if present
    const range = document.createRange();
    range.selectNodeContents(this.targetElement.nativeElement);
    range.deleteContents();
    //

    const container = document.createElement('div');
    this.targetElement.nativeElement.appendChild(container)
    //


    if (window['grecaptcha']) {
      grecaptcha.render(container, {
        sitekey: this.apiKey,
        hl: this.translate.currentLang,
        callback: (res) => {
          this.recaptchaResponse.emit(res);
        }
      });
    }
  }

}
