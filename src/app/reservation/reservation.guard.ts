import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ReservationService } from '../shared/reservation.service';

@Injectable({
    providedIn: 'root'
})
export class ReservationGuard implements CanActivate {

    constructor(private reservationService: ReservationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        console.log('guard here');
        return true;
    }
}