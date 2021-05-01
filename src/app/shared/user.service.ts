import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {ANONYMOUS, User} from '../model/user';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class UserService {

  constructor(private http: HttpClient) {
  }

  getUserIdentity(): Observable<User> {
    return this.http.get<User>('/api/v2/public/user/me', { observe: 'response' })
      .pipe(map(response => {
        if (response.status === 204) {
          return ANONYMOUS;
        } else {
          return response.body;
        }
      }));
  }

  logout(): Observable<boolean> {
    return this.http.post<any>('/api/v2/public/user/logout', {}, { observe: 'response' })
      .pipe(map(response => {
        console.log('response ok', response.ok);
        return response.ok;
      }));
  }
}
