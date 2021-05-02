import {BillingDetails} from './reservation-info';

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
