import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from 'rxjs';
import { TicketInfo } from '../model/ticket-info';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    constructor(private http: HttpClient) { }


    getTicketInfo(eventName: string, ticketIdentifier: string): Observable<TicketInfo> {
        return this.http.get<TicketInfo>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}`);
    }
}