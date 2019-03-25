import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {

    constructor(private http: HttpClient) { }

    public reserveTickets(eventShortName: string, reservation: any): Observable<any> {
        return this.http.post(`/api/v2/public/event/${eventShortName}/reserve-tickets`, reservation);
    }


    public getReservationInfo(eventShortName: string, reservationId: string): Observable<any> {
        return this.http.get(`/api/v2/public/event/${eventShortName}/reservation/${reservationId}/book`);
    }
}