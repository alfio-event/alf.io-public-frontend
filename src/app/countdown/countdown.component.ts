import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import countdown from 'countdown'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html'
})
export class CountdownComponent implements OnInit, OnDestroy {

  @Input()
  validity: number;

  @Output()
  onExpired: EventEmitter<boolean> = new EventEmitter<boolean>()

  timerId: number;

  message: string;
  expired: boolean;

  private langChangeSub: Subscription;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    this.setupCountdown();

    this.langChangeSub = this.translateService.onLangChange.subscribe(e => {
      this.setupCountdown();
    });
  }

  ngOnDestroy() {
    if(this.langChangeSub) {
      this.langChangeSub.unsubscribe();
    }
    clearInterval(this.timerId);
  }

  private setupCountdown(): void {

    clearInterval(this.timerId);

    const msg = this.translateService.instant('reservation-page.time-for-completion');
    const singular = this.translateService.instant('reservation-page.time-for-completion.labels.singular');
    const plural = this.translateService.instant('reservation-page.time-for-completion.labels.plural');
    const and = this.translateService.instant('reservation-page.time-for-completion.labels.and');

    countdown.setLabels(singular, plural, ' ' + and + ' ', ', ');
    this.timerId = countdown(new Date(this.validity), (ts) => {
      if (ts.value < 0) {
        this.message = msg.replace('##time##', ts.toHTML("strong"));
      } else {
        this.expired = true;
        clearInterval(this.timerId);
        this.onExpired.emit(true);
      }
    }, countdown.MONTHS|countdown.WEEKS|countdown.DAYS|countdown.HOURS|countdown.MINUTES|countdown.SECONDS);
  }

}
