import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationService } from '../shared/reservation.service';
import { ReservationStatus } from '../model/reservation-info';
import { SuccessComponent } from './success/success.component';
import { OverviewComponent } from './overview/overview.component';
import { BookingComponent } from './booking/booking.component';

@Injectable({
    providedIn: 'root'
})
export class ReservationGuard implements CanActivate {

    constructor(private reservationService: ReservationService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        
        
        const eventShortName = route.params['eventShortName'];
        const reservationId = route.params['reservationId'];
        return this.reservationService.getReservationInfo(eventShortName, reservationId).pipe(map(reservation => {

            const selectedComponent = getCorrespondingController(reservation.status, reservation.validatedBookingInformations);
            if (route.component === selectedComponent) {
                return true;
            }

            return this.router.createUrlTree(getRouteFromComponent(selectedComponent, eventShortName, reservationId));
        }));
    }
}

function getRouteFromComponent(component: any, eventShortName: string, reservationId: string) {
    if (component === OverviewComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'overview'];
    } else if (component === BookingComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'book'];
    } else if (component === SuccessComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'success'];
    }
}

function getCorrespondingController(status: ReservationStatus, validatedBookingInformations: boolean) {
    switch (status) {
        case 'PENDING': return validatedBookingInformations ? OverviewComponent : BookingComponent;
        case 'COMPLETE': return SuccessComponent;
        case 'OFFLINE_PAYMENT': break;
        case 'EXTERNAL_PROCESSING_PAYMENT':
        case 'WAITING_EXTERNAL_CONFIRMATION': break;
        case 'IN_PAYMENT':
        case 'STUCK': break;
    }
}