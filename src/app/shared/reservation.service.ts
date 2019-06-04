import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { ReservationRequest } from '../model/reservation-request';
import { ValidatedResponse } from '../model/validated-response';
import { OverviewConfirmation } from '../model/overview-confirmation';
import { ReservationInfo, ReservationStatusInfo } from '../model/reservation-info';
import { ReservationPaymentResult } from '../model/reservation-payment-result';
import { TransactionInitializationToken } from '../model/payment';
import { WaitingListSubscriptionRequest } from '../model/waiting-list-subscription-request';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient) { }

    reserveTickets(eventShortName: string, reservation: ReservationRequest, lang: string): Observable<ValidatedResponse<string>> {
        return this.http.post<ValidatedResponse<string>>(`/api/v2/public/event/${eventShortName}/reserve-tickets`, reservation, {params: {lang: lang}});
    }

    submitWaitingListSubscriptionRequest(eventShortName: string, waitingListSubscriptionRequest: WaitingListSubscriptionRequest): Observable<ValidatedResponse<boolean>> {
        return this.http.post<ValidatedResponse<boolean>>(`/api/v2/public/event/${eventShortName}/waiting-list/subscribe`, waitingListSubscriptionRequest);
    }

    getReservationInfo(eventShortName: string, reservationId: string): Observable<ReservationInfo> {
        return this.http.get<ReservationInfo>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}`);
    }

    getReservationStatusInfo(eventShortName: string, reservationId: string): Observable<ReservationStatusInfo> {
        return this.http.get<ReservationStatusInfo>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/status`);
    }

    cancelPendingReservation(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.delete<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}`);
    }

    validateToOverview(eventShortName: string, reservationId: string, contactsAndTicket: any, lang: string): Observable<ValidatedResponse<boolean>> {
        return this.http.post<ValidatedResponse<boolean>>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/validate-to-overview`, contactsAndTicket, {params: {lang: lang}});
    }

    confirmOverview(eventShortName: string, reservationId: string, overviewForm: OverviewConfirmation, lang: string): Observable<ValidatedResponse<ReservationPaymentResult>> {
        return this.http.post<ValidatedResponse<ReservationPaymentResult>>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}`, overviewForm, {params: {lang: lang}});
    }

    backToBooking(eventShortName: string, reservationId: string) : Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/back-to-booking`, {});
    }

    reSendReservationEmail(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/re-send-email`, {});
    }

    initPayment(eventShortName: string, reservationId: string): Observable<TransactionInitializationToken> {
        return this.http.post<TransactionInitializationToken>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/payment/CREDIT_CARD/init`, {});
    }

    getPaymentStatus(eventShortName: string, reservationId: string): Observable<ReservationPaymentResult> {
        return this.http.get<ReservationPaymentResult>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/payment/CREDIT_CARD/status`);
    }
    
}