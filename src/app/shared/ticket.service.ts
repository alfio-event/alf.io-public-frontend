import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {from, Observable, of} from 'rxjs';
import {TicketInfo} from '../model/ticket-info';
import {FormArray, FormBuilder, FormGroup} from '@angular/forms';
import {AdditionalField, Ticket} from '../model/ticket';
import {ValidatedResponse} from '../model/validated-response';
import {AdditionalServiceWithData, TicketsByTicketCategory} from '../model/reservation-info';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ReleaseTicketComponent} from '../reservation/release-ticket/release-ticket.component';
import {map, mergeMap} from 'rxjs/operators';
import {User, UserAdditionalData} from '../model/user';
import {DateValidity} from '../model/date-validity';
import {DownloadTicketComponent} from '../reservation/download-ticket/download-ticket.component';
import {WalletConfiguration} from '../model/info';

@Injectable({
    providedIn: 'root'
})
export class TicketService {

    private static getUserDataLabelValue(name: string, index: number, userLanguage?: string, additionalData?: UserAdditionalData): {l: string, v: string} | null {
      if (additionalData != null && additionalData[name] && additionalData[name].values.length > index) {
        const val = additionalData[name];
        return { l: val.label[userLanguage] || val.label[0], v: val.values[index] };
      }
      return { l: null, v: null };
    }

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

    getOnlineCheckInInfo(eventName: string, ticketIdentifier: string, checkInCode: string): Observable<DateValidity> {
      return this.http.get<DateValidity>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}/code/${checkInCode}/check-in-info`, {
        params: {
          tz: this.retrieveTimezone()
        }
      });
    }

    sendTicketByEmail(eventName: string, ticketIdentifier: string): Observable<boolean> {
        return this.http.post<boolean>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}/send-ticket-by-email`, {});
    }

    buildFormGroupForTicket(ticket: Ticket, user?: User, additionalServicesWithData?: AdditionalServiceWithData[]): FormGroup {
        return this.formBuilder.group(this.buildTicket(ticket, user, additionalServicesWithData));
    }

    buildAdditionalServicesFormGroup(additionalServices: AdditionalServiceWithData[], lang: string): FormGroup {
      const byTicketUuid: {[k: string]: FormArray} = {};
      additionalServices.forEach(asw => {
        if (byTicketUuid[asw.ticketUUID] == null) {
          byTicketUuid[asw.ticketUUID] = this.formBuilder.array([]);
        }
        byTicketUuid[asw.ticketUUID].push(this.buildAdditionalServiceGroup(asw, lang));
      });

      return this.formBuilder.group(byTicketUuid);
    }

    buildAdditionalServiceGroup(asw: AdditionalServiceWithData, lang: string): FormGroup {
      return this.formBuilder.group({
        additionalServiceItemId: this.formBuilder.control(asw.itemId),
        additionalServiceTitle: asw.title,
        ticketUUID: this.formBuilder.control(asw.ticketUUID),
        additional: this.buildAdditionalFields(asw.ticketFieldConfiguration, null, lang)
      });
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

    openDownloadTicket(ticket: Ticket, eventName: string, walletConfiguration: WalletConfiguration): Observable<boolean> {
      const modal = this.modalService.open(DownloadTicketComponent, {centered: true});
      const instance: DownloadTicketComponent = modal.componentInstance;
      instance.ticket = ticket;
      instance.eventName = eventName;
      instance.walletConfiguration = walletConfiguration;
      return from(modal.result)
        .pipe(map(_ => true));
    }

    releaseTicket(eventName: string, ticketIdentifier: string): Observable<boolean> {
      return this.http.delete<boolean>(`/api/v2/public/event/${eventName}/ticket/${ticketIdentifier}`, {});
    }

    private buildTicket(ticket: Ticket,
                        user?: User,
                        additionalServicesWithData?: AdditionalServiceWithData[]) {
      return {
          firstName: ticket.firstName || user?.firstName,
          lastName: ticket.lastName || user?.lastName,
          email: ticket.email || user?.emailAddress,
          userLanguage: ticket.userLanguage,
          additional: this.buildAdditionalFields(ticket.ticketFieldConfigurationBeforeStandard,
            ticket.ticketFieldConfigurationAfterStandard, ticket.userLanguage, user?.profile?.additionalData),
          additionalServices: this.buildAdditionalServicesFormGroup(additionalServicesWithData ?? [], ticket.uuid)
      };
    }

    public buildAdditionalFields(before: AdditionalField[], after: AdditionalField[], userLanguage: string, userData?: UserAdditionalData): FormGroup {
      const additional = {};
      if (before) {
        this.buildSingleAdditionalField(before, additional, userLanguage, userData);
      }
      if (after) {
        this.buildSingleAdditionalField(after, additional, userLanguage, userData);
      }
      return this.formBuilder.group(additional);
    }

    private buildSingleAdditionalField(a: AdditionalField[], additional: {}, userLanguage: string, userData?: UserAdditionalData): void {
      a.forEach(f => {
        const arr = [];

        if (f.type === 'checkbox') { // pre-fill with empty values for the checkbox cases, as we can have multiple values!
          for (let i = 0; i < f.restrictedValues.length; i++) {
            arr.push(this.formBuilder.control(null));
          }
        }

        f.fields.forEach(field => {
          arr[field.fieldIndex] = this.formBuilder.control(field.fieldValue || TicketService.getUserDataLabelValue(f.name, field.fieldIndex, userLanguage, userData).v);
        });
        additional[f.name] = this.formBuilder.array(arr);
      });
    }

    private retrieveTimezone(): string | null {
      try {
        return Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch (e) {
        return null;
      }
    }
}
