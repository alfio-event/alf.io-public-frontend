import {ReservationStatus} from './reservation-info';

export class ReservationStatusChanged {
  constructor(public status: ReservationStatus, public id: string) {}
}

export interface EmbeddingConfiguration {
  enabled: boolean;
  notificationOrigin: string;
}
