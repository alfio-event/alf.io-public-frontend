import {BillingDetails} from './reservation-info';

export interface User {
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  profile?: UserProfile;
}

export interface UserProfile {
  billingDetails: BillingDetails;
  additionalData: { [key: string]: string[] };
}

export const ANONYMOUS: User = {};
