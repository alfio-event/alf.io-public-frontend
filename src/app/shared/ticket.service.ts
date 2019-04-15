import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    constructor(private http: HttpClient) { }


    getTicketInfo(eventName: string, ticketIdentifier: string): Observable<any> {
        return this.http.get(`/api/v2/public/tmp/event/${eventName}/ticket/${ticketIdentifier}`);
    }
}