import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import countdown from 'countdown'

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.scss']
})
export class CountdownComponent implements OnInit, OnDestroy {

  @Input()
  validity: number;

  timerId: NodeJS.Timer;

  message: string;
  expired: boolean;

  constructor(private translateService: TranslateService) { }

  ngOnInit() {
    console.log(this.validity);
    this.setupCountdown();

    this.translateService.onLangChange.subscribe(e => {
      this.setupCountdown();
    });
  }

  ngOnDestroy() {
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
      }
    }, countdown.MONTHS|countdown.WEEKS|countdown.DAYS|countdown.HOURS|countdown.MINUTES|countdown.SECONDS);
  }

}
