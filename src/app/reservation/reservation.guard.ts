import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { ReservationService } from '../shared/reservation.service';
import { ReservationStatus } from '../model/reservation-info';
import { SuccessComponent } from './success/success.component';
import { OverviewComponent } from './overview/overview.component';
import { BookingComponent } from './booking/booking.component';
import { OfflinePaymentComponent } from './offline-payment/offline-payment.component';
import { ProcessingPaymentComponent } from './processing-payment/processing-payment.component';
import { NotFoundComponent } from './not-found/not-found.component';

@Injectable({
    providedIn: 'root'
})
export class ReservationGuard implements CanActivate {

    constructor(private reservationService: ReservationService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        return this.checkAndRedirect(route.params['eventShortName'], route.params['reservationId'], route.component);
    }

    private checkAndRedirect(eventShortName: string, reservationId: string, component: any): Observable<boolean | UrlTree> {
        return this.reservationService.getReservationStatusInfo(eventShortName, reservationId)
            .pipe(catchError(err => of({ status: <ReservationStatus>'NOT_FOUND', validatedBookingInformation: false })), map(reservation => {
                const selectedComponent = getCorrespondingController(reservation.status, reservation.validatedBookingInformation);
                if (component === selectedComponent) {
                    return true;
                }
                return this.router.createUrlTree(getRouteFromComponent(selectedComponent, eventShortName, reservationId), {replaceUrl: true});
            }));
    }
}

function getRouteFromComponent(component: any, eventShortName: string, reservationId: string): string[] {
    if (component === OverviewComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'overview'];
    } else if (component === BookingComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'book'];
    } else if (component === SuccessComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'success'];
    } else if (component === OfflinePaymentComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'waiting-payment'];
    } else if (component === ProcessingPaymentComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'processing-payment'];
    } else if (component === NotFoundComponent) {
        return ['event', eventShortName, 'reservation', reservationId, 'not-found'];
    }
}

function getCorrespondingController(status: ReservationStatus, validatedBookingInformations: boolean) {
    switch (status) {
        case 'PENDING': return validatedBookingInformations ? OverviewComponent : BookingComponent;
        case 'COMPLETE': return SuccessComponent;
        case 'OFFLINE_PAYMENT': return OfflinePaymentComponent;
        case 'EXTERNAL_PROCESSING_PAYMENT':
        case 'WAITING_EXTERNAL_CONFIRMATION': return ProcessingPaymentComponent;
        case 'NOT_FOUND': return NotFoundComponent;
        case 'IN_PAYMENT':
        case 'STUCK': break;
    }
}
