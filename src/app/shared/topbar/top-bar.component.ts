import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {ANONYMOUS, User} from '../../model/user';
import {Language} from '../../model/event';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit, OnDestroy {

  private authenticationStatusSubscription?: Subscription;
  @Input()
  contentLanguages: Language[];
  @Input()
  displayLoginButton = true;
  user?: User;
  authenticationEnabled = false;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.authenticationStatusSubscription = this.userService.authenticationStatus.subscribe(authenticationStatus => {
      this.authenticationEnabled = authenticationStatus.enabled;
      if (authenticationStatus.user !== ANONYMOUS) {
        this.user = authenticationStatus.user;
      }
    });
  }

  ngOnDestroy(): void {
    this.authenticationStatusSubscription?.unsubscribe();
  }

  get anonymous(): boolean {
    return this.user === ANONYMOUS;
  }

  logout(): void {
    this.userService.logout().subscribe(success => {
      if (success) {
        this.user = undefined;
      }
    });
  }
}
