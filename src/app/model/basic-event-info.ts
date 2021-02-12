import { DateValidity, DatesWithOffset } from './date-validity';
import { EventFormat } from './event';
import {HttpParams} from '@angular/common/http';
import {Params} from '@angular/router';

export class BasicEventInfo implements DateValidity {
    shortName: string;
    fileBlobId: string;
    format: EventFormat;
    title: {[key: string]: string};
    location: string;

    // date related
    timeZone: string;
    sameDay: boolean;
    datesWithOffset: DatesWithOffset;
    formattedBeginDate: {[key: string]: string}; // day, month, year
    formattedBeginTime: {[key: string]: string}; // the hour/minute component
    formattedEndDate: {[key: string]: string};
    formattedEndTime: {[key: string]: string};
    //

}

export class EventSearchParams {
  public constructor(private subscription: string,
              private organizer: string,
              private tags: Array<string>) {
  }

  public static fromQueryParams(params: Params): EventSearchParams {
    return new EventSearchParams(params.subscription, params.organizer, params.tags);
  }

  public static transformParams(params: Params): Params {
    return EventSearchParams.fromQueryParams(params).toParams();
  }

  public toHttpParams(): HttpParams {
    return new HttpParams({
      fromObject: this.extractParams()
    });
  }

  public toParams(): Params {
    return this.extractParams();
  }

  private extractParams(): {[param: string]: string | ReadonlyArray<string>} {
    const obj: {[param: string]: string | ReadonlyArray<string>} = {};
    if (this.subscription != null) {
      obj.subscription = this.subscription;
    }
    if (this.organizer != null) {
      obj.organizer = this.organizer;
    }
    if (this.tags != null) {
      obj.tags = this.tags;
    }
    return obj;
  }

}
