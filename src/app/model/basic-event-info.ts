import { DateValidity, EventDatesWithOffset } from './date-validity';
import { EventFormat } from './event';

export class BasicEventInfo implements DateValidity {
    shortName: string;
    fileBlobId: string;
    format: EventFormat;
    displayName: string;
    location: string;

    // date related
    timeZone: string;
    sameDay: boolean;
    datesWithOffset: EventDatesWithOffset;
    formattedBeginDate: {[key: string]: string}; // day, month, year
    formattedBeginTime: {[key: string]: string}; // the hour/minute component
    formattedEndDate: {[key: string]: string};
    formattedEndTime: {[key: string]: string};
    //

}
