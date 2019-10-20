export interface DateValidity {
    
    timeZone: string;
    sameDay: boolean;
    datesWithOffset: EventDatesWithOffset;
    formattedBeginDate: {[key:string]: string}; // day, month, year
    formattedBeginTime: {[key:string]: string}; //the hour/minute component
    formattedEndDate: {[key:string]: string};
    formattedEndTime: {[key:string]: string};
}

export interface EventDatesWithOffset {
    startDateTime: number;
    startTimeZoneOffset: number;
    endDateTime: number;
    endTimeZoneOffset: number;
}
