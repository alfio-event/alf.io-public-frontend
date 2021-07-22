import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {ANONYMOUS, User} from '../../model/user';
import {Language} from '../../model/event';
import {Subscription} from 'rxjs';
import {Router} from '@angular/router';

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

  constructor(private userService: UserService, private router: Router) {
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
    this.userService.logout().subscribe(response => {
      this.user = undefined;
      if (!response.empty) {
        window.location.href = response.targetUrl;
      }
    });
  }

  myOrders(): void {
    this.router.navigate(['my-orders']);
  }

  myProfile(): void {
    this.router.navigate(['my-profile']);
  }
}
