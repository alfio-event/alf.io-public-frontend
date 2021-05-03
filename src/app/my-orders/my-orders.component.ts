import {Component, OnInit} from '@angular/core';
import {UserService} from '../shared/user.service';
import {PurchaseContextWithReservation, ReservationHeader} from '../model/user';
import {TranslateService} from '@ngx-translate/core';
import {I18nService} from '../shared/i18n.service';
import {Language} from '../model/event';
import {IconProp} from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.component.html'
})
export class MyOrdersComponent implements OnInit {

  orders: Array<PurchaseContextWithReservation> = [];
  languages: Language[];

  constructor(private userService: UserService,
              private translateService: TranslateService,
              private i18nService: I18nService) {
  }

  ngOnInit(): void {
    this.userService.getOrders()
      .subscribe(array => this.orders = array);
    this.i18nService.getAvailableLanguages().subscribe(res => {
      this.languages = res;
    });
    this.i18nService.setPageTitle('user.menu.my-orders', null);
  }

  localizedTitle(p: PurchaseContextWithReservation): string {
    const lang = this.translateService.currentLang;
    if (p.title[lang] != null) {
      return p.title[lang];
    }
    return p.title[Object.keys(p.title)[0]];
  }

  getStatusIcon(reservation: ReservationHeader): IconProp {
    if (reservation.status === 'COMPLETE') {
      return ['fas', 'check'];
    }
    return ['far', 'clock'];
  }

  getTextClass(reservation: ReservationHeader): string {
    if (reservation.status === 'COMPLETE') {
      return 'text-success';
    }
    return 'text-warning';
  }

  getStatusDescription(reservation: ReservationHeader): string {
    if (reservation.status === 'COMPLETE') {
      return 'my-orders.status.complete';
    }
    return 'my-orders.status.pending';
  }
}
