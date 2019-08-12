import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EventService } from './shared/event.service';
import { map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventGuard implements CanActivate {

  constructor(private eventService: EventService) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    const eventShortName = next.params['eventShortName'];
    return this.eventService.getEvent(eventShortName).pipe(catchError(e => of(false)), map(e => e !== false));
  }
}
