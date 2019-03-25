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
}