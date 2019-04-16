import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient) { }

    public reserveTickets(eventShortName: string, reservation: any): Observable<any> {
        return this.http.post(`/api/v2/public/tmp/event/${eventShortName}/reserve-tickets`, reservation);
    }

    public getReservationInfo(eventShortName: string, reservationId: string): Observable<any> {
        return this.http.get(`/api/v2/public/tmp/event/${eventShortName}/reservation/${reservationId}/book`);
    }

    public cancelPendingReservation(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.delete<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}`);
    }

    public validateToOverview(eventShortName: string, reservationId: string, contactsAndTicket: any): Observable<any> {
        return this.http.post(`/api/v2/public/tmp/event/${eventShortName}/reservation/${reservationId}/validate-to-overview`, contactsAndTicket);
    }

    public getOverview(eventShortName: string, reservationId: string): Observable<any> {
        return this.http.get(`/api/v2/public/tmp/event/${eventShortName}/reservation/${reservationId}/overview`);
    }

    public confirmOverview(eventShortName: string, reservationId: string, overviewForm: any): Observable<any> {
        return this.http.post(`/api/v2/public/tmp/event/${eventShortName}/reservation/${reservationId}`, overviewForm);
    }

    public backToBooking(eventShortName: string, reservationId: string) : Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/back-to-booking`, {});
    }

    public getSuccess(eventShortName: string, reservationId: string): Observable<any> {
        return this.http.get(`/api/v2/public/tmp/event/${eventShortName}/reservation/${reservationId}/success`);
    }

    public reSendReservationEmail(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/re-send-email`, {});
    }
    
}