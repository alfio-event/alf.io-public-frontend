import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, empty, of } from 'rxjs';
import { TicketInfo } from '../model/ticket-info';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Ticket, AdditionalField } from '../model/ticket';
import { ValidatedResponse } from '../model/validated-response';
import { TicketsByTicketCategory } from '../model/reservation-info';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReleaseTicketComponent } from '../reservation/release-ticket/release-ticket.component';
import { mergeMap } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    constructor(
        private http: HttpClient,
        private formBuilder: FormBuilder,
        private modalService: NgbModal) { }

    getTicketInfo(eventName: string, ticketIdentifier: string): Observable<TicketInfo> {
        return this.http.get<TicketInfo>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}`);
    }

    getTicket(eventName: string, ticketIdentifier: string): Observable<TicketsByTicketCategory> {
      return this.http.get<TicketsByTicketCategory>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}/full`);
    }

    sendTicketByEmail(eventName: string, ticketIdentifier: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}/send-ticket-by-email`, {});
    }

    buildFormGroupForTicket(ticket: Ticket): FormGroup {
        return this.formBuilder.group(this.buildTicket(ticket));
    }


    updateTicket(eventName: string, ticketIdentifier: string, ticket: any): Observable<ValidatedResponse<boolean>> {
      return this.http.put<ValidatedResponse<boolean>>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}`, ticket);
    }

    openReleaseTicket(ticket: Ticket, eventName: string): Observable<boolean> {
      return from(this.modalService.open(ReleaseTicketComponent, {centered: true}).result)
        .pipe(mergeMap(res => {
          if (res === 'yes') {
            return this.releaseTicket(eventName, ticket.uuid);
          } else {
            return of(false);
          }
        }));
    }

    releaseTicket(eventName: string, ticketIdentifier: string): Observable<boolean> {
      return this.http.delete<boolean>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}`, {});
    }

    private buildTicket(ticket: Ticket): {firstName: string, lastName: string, email: string, userLanguage, additional: FormGroup} {
      return {
          firstName: ticket.firstName,
          lastName: ticket.lastName,
          email: ticket.email,
          userLanguage: ticket.userLanguage,
          additional: this.buildAdditionalFields(ticket.ticketFieldConfigurationBeforeStandard,
            ticket.ticketFieldConfigurationAfterStandard)
      };
    }

    private buildAdditionalFields(before: AdditionalField[], after: AdditionalField[]): FormGroup {
      const additional = {};
      if (before) {
        this.buildSingleAdditionalField(before, additional);
      }
      if (after) {
        this.buildSingleAdditionalField(after, additional);
      }
      return this.formBuilder.group(additional);
    }

    private buildSingleAdditionalField(a: AdditionalField[], additional: {}): void {
      a.forEach(f => {
        const arr = [];

        if (f.type === 'checkbox') { // pre-fill with empty values for the checkbox cases, as we can have multiple values!
          for (let i = 0; i < f.restrictedValues.length; i++) {
            arr.push(this.formBuilder.control(null));
          }
        }

        f.fields.forEach(field => {
          arr[field.fieldIndex] = this.formBuilder.control(field.fieldValue);
        });
        additional[f.name] = this.formBuilder.array(arr);
      });
    }
}
