import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ReservationRequest } from '../model/reservation-request';
import { ValidatedResponse } from '../model/validated-response';
import { OverviewConfirmation } from '../model/overview-confirmation';
import { ReservationInfo, ReservationStatusInfo } from '../model/reservation-info';
import { ReservationPaymentResult } from '../model/reservation-payment-result';
import { TransactionInitializationToken } from '../model/payment';
import { DynamicDiscount } from '../model/event-code';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient) { }

    reserveTickets(eventShortName: string, reservation: ReservationRequest, lang: string): Observable<ValidatedResponse<string>> {
        return this.http.post<ValidatedResponse<string>>(`/api/v2/public/event/${eventShortName}/reserve-tickets`, reservation, {params: {lang: lang}});
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

    validateToOverview(eventShortName: string, reservationId: string, contactsAndTicket: any, lang: string, ignoreWarnings: boolean): Observable<ValidatedResponse<boolean>> {
        const url = `/api/v2/public/event/${eventShortName}/reservation/${reservationId}/validate-to-overview`;
        return this.http.post<ValidatedResponse<boolean>>(url, contactsAndTicket, {params: {lang: lang, ignoreWarnings: '' + ignoreWarnings}});
    }

    confirmOverview(eventShortName: string, reservationId: string, overviewForm: OverviewConfirmation, lang: string): Observable<ValidatedResponse<ReservationPaymentResult>> {
        const url = `/api/v2/public/event/${eventShortName}/reservation/${reservationId}`;
        return this.http.post<ValidatedResponse<ReservationPaymentResult>>(url, overviewForm, {params: {lang: lang}});
    }

    backToBooking(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/back-to-booking`, {});
    }

    reSendReservationEmail(eventShortName: string, reservationId: string, lang: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/re-send-email`, {}, {params: {lang: lang}});
    }

    initPayment(eventShortName: string, reservationId: string): Observable<TransactionInitializationToken> {
        return this.http.post<TransactionInitializationToken>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/payment/CREDIT_CARD/init`, {});
    }

    getPaymentStatus(eventShortName: string, reservationId: string): Observable<ReservationPaymentResult> {
        return this.http.get<ReservationPaymentResult>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/payment/CREDIT_CARD/status`);
    }

    forcePaymentStatusCheck(eventShortName: string, reservationId: string): Observable<ReservationPaymentResult> {
        return this.http.get<ReservationPaymentResult>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/transaction/force-check`);
    }

    removePaymentToken(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.delete<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/payment/token`);
    }

    resetPaymentStatus(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.delete<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/payment`);
    }

    registerPaymentAttempt(eventShortName: string, reservationId: string): Observable<boolean> {
        return this.http.put<boolean>(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/payment`, {});
    }

    checkDynamicDiscountAvailability(eventShortName: string, reservation: ReservationRequest): Observable<DynamicDiscount> {
        return this.http.post<DynamicDiscount>(`/api/v2/public/event/${eventShortName}/check-discount`, reservation);
    }
}
