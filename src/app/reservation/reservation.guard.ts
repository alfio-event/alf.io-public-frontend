import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationService } from '../shared/reservation.service';

@Injectable({
    providedIn: 'root'
})
export class ReservationGuard implements CanActivate {

    constructor(private reservationService: ReservationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        const eventShortName = route.parent.params['eventShortName'];
        const reservationId = route.parent.params['reservationId'];
        return this.reservationService.getReservationInfo(eventShortName, reservationId).pipe(map(reservation => {
            console.log('res in guard', reservation)
            return true;
        }));
    }
}