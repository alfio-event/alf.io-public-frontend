import {Component, Input, OnInit} from '@angular/core';
import {UserService} from '../user.service';
import {ANONYMOUS, User} from '../../model/user';
import {Language} from '../../model/event';

@Component({
  selector: 'app-topbar',
  templateUrl: './top-bar.component.html'
})
export class TopBarComponent implements OnInit {

  @Input()
  contentLanguages: Language[];
  @Input()
  displayLoginButton = true;
  user?: User;

  constructor(private userService: UserService) {
  }

  ngOnInit(): void {
    this.userService.getUserIdentity().subscribe(user => {
      if (user !== ANONYMOUS) {
        this.user = user;
      }
    });
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
