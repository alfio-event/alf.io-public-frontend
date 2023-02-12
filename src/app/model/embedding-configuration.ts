import {ReservationStatus} from './reservation-info';

export class ReservationStatusChanged {
  constructor(public status: ReservationStatus, public id: string, public error?: any) {}
}

export interface EmbeddingConfiguration {
  enabled: boolean;
  notificationOrigin: string;
}
