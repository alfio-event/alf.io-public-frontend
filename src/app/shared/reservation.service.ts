import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ReservationRequest } from '../model/reservation-request';
import { ValidatedResponse } from '../model/validated-response';
import { OverviewConfirmation } from '../model/overview-confirmation';
import { ReservationInfo, ReservationStatusInfo } from '../model/reservation-info';
import { ReservationPaymentResult } from '../model/reservation-payment-result';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient) { }

    public reserveTickets(eventShortName: string, reservation: ReservationRequest): Observable<ValidatedResponse<string>> {
        return this.http.post<ValidatedResponse<string>>(`/api/v2/public/event/${eventShortName}/reserve-tickets`, reservation);
    }

    public getReservationInfo(eventShortName: string, reservationId: string): Observable<ReservationInfo> {
        return this.http.get<ReservationInfo>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}`);
    }

    public getReservationStatusInfo(eventShortName: string, reservationId: string): Observable<ReservationStatusInfo> {
        return this.http.get<ReservationStatusInfo>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/status`);
    }

    public cancelPendingReservation(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.delete<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}`);
    }

    public validateToOverview(eventShortName: string, reservationId: string, contactsAndTicket: any): Observable<ValidatedResponse<boolean>> {
        return this.http.post<ValidatedResponse<boolean>>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/validate-to-overview`, contactsAndTicket);
    }

    public confirmOverview(eventShortName: string, reservationId: string, overviewForm: OverviewConfirmation): Observable<ValidatedResponse<ReservationPaymentResult>> {
        return this.http.post<ValidatedResponse<ReservationPaymentResult>>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}`, overviewForm);
    }

    public backToBooking(eventShortName: string, reservationId: string) : Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/back-to-booking`, {});
    }

    public reSendReservationEmail(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/re-send-email`, {});
    }
    
}