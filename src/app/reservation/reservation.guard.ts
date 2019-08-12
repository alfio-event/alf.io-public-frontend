import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ReservationService } from '../shared/reservation.service';
import { ReservationStatus } from '../model/reservation-info';
import { SuccessComponent } from './success/success.component';
import { OverviewComponent } from './overview/overview.component';
import { BookingComponent } from './booking/booking.component';
import { OfflinePaymentComponent } from './offline-payment/offline-payment.component';
import { ReservationComponent } from './reservation.component';
import { ProcessingPaymentComponent } from './processing-payment/processing-payment.component';

@Injectable({
    providedIn: 'root'
})
export class ReservationGuard implements CanActivate {

    constructor(private reservationService: ReservationService, private router: Router) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | boolean {
        // handle the case of the parent component
        if (route.component === ReservationComponent) {
            if (route.children.length === 0) {
                // no children! -> go to /event/<eventShortName>/reservation/<reservationId>/ -> redirect
                return this.checkAndRedirect(route.params['eventShortName'], route.params['reservationId'], route.component);
            }
            return true;
        } else {
            // case for childrens
            return this.checkAndRedirect(route.parent.params['eventShortName'], route.parent.params['reservationId'], route.component);
        }
    }

    private checkAndRedirect(eventShortName: string, reservationId: string, component: any): Observable<boolean | UrlTree> {
        return this.reservationService.getReservationStatusInfo(eventShortName, reservationId).pipe(map(reservation => {

            const selectedComponent = getCorrespondingController(reservation.status, reservation.validatedBookingInformation);
            if (component === selectedComponent) {
                return true;
            }

            return this.router.createUrlTree(getRouteFromComponent(selectedComponent, eventShortName, reservationId));
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
    }
}

function getCorrespondingController(status: ReservationStatus, validatedBookingInformations: boolean) {
    switch (status) {
        case 'PENDING': return validatedBookingInformations ? OverviewComponent : BookingComponent;
        case 'COMPLETE': return SuccessComponent;
        case 'OFFLINE_PAYMENT': return OfflinePaymentComponent;
        case 'EXTERNAL_PROCESSING_PAYMENT':
        case 'WAITING_EXTERNAL_CONFIRMATION': return ProcessingPaymentComponent;
        case 'IN_PAYMENT':
        case 'STUCK': break;
    }
}
