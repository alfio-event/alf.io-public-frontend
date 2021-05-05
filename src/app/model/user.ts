import {BillingDetails, ReservationStatus} from './reservation-info';
import {PurchaseContextType} from '../shared/purchase-context.service';

export interface AuthenticationStatus {
  enabled: boolean;
  user?: User;
}

export interface User {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  billingDetails: BillingDetails;
  additionalData: UserAdditionalData;
}

export interface UserAdditionalData {
  [key: string]: string[];
}

export const ANONYMOUS: User = {};

export interface PurchaseContextWithReservation {
  title: { [lang: string]: string };
  publicIdentifier: string;
  type: PurchaseContextType;
  reservations: Array<ReservationHeader>;
}

export interface ReservationHeader {
  id: string;
  status: ReservationStatus;
  expiresOn: string;
  confirmedOn: string;
  createdOn: string;
  invoiceNumber: string;
  finalPrice: string;
  currencyCode: string;
  usedVatPercent: string;
  vatStatus: string;
}
