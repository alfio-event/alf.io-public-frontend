import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { EventService } from './shared/event.service';
import { map, catchError, tap } from 'rxjs/operators';
import { Event } from './model/event';

@Injectable({
  providedIn: 'root'
})
export class EventGuard implements CanActivate {

  constructor(private eventService: EventService, private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> {
    const eventShortName = next.params['eventShortName'];
    return this.eventService.getEvent(eventShortName)
      .pipe(tap((e) => this.handleCustomCss(e)), catchError(e => of(this.router.parseUrl(''))), map(e => e instanceof UrlTree ? e : true));
  }

  handleCustomCss(event: Event): void {
    if (event.customCss === null) {
      //remove all custom event styles, as this event does not have any override
      const found = document.head.querySelectorAll('style[data-event-custom-css]');
      found.forEach(e => e.remove());
    } else {
      const id = 'event-custom-css-' + event.organizationName + '-' + event.shortName;
      const a = document.getElementById('event-custom-css-' + event.organizationName + '-' + event.shortName);
      const found = document.head.querySelectorAll('style[data-event-custom-css]');

      //remove all custom event styles already present, as we don't have the one for this event
      if (a === null && found.length > 0) {
        found.forEach(e => e.remove());
      }

      //create custom css
      if (a === null) {
        const style = document.createElement('style');
        style.setAttribute('id', id);
        style.setAttribute('type', 'text/css')
        style.setAttribute('data-event-custom-css', 'true');
        style.textContent = event.customCss;
        document.head.appendChild(style)
      }
    }
  }
}
