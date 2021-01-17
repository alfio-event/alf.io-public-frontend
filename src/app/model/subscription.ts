import { AnalyticsConfiguration } from './analytics-configuration';
import { AssignmentConfiguration, CaptchaConfiguration, CurrencyDescriptor, InvoicingConfiguration, Language } from './event';
import { PurchaseContext } from './purchase-context';
import {DatesWithOffset} from './date-validity';

export class BasicSubscriptionInfo {
    id: string;
    fileBlobId: string;
    title: {[lang: string]: string};
    description: {[lang: string]: string};
    price: number;
    currency: string;
    vat: number;
    vatStatus: string;
    datesWithOffset: DatesWithOffset;
    formattedOnSaleFrom: {[key: string]: string};
    formattedOnSaleTo: {[key: string]: string};
}

export class SubscriptionInfo implements PurchaseContext {
    id: string;

    // FIXME
    displayName: string;
    invoicingConfiguration: InvoicingConfiguration;
    assignmentConfiguration: AssignmentConfiguration;
    analyticsConfiguration: AnalyticsConfiguration;
    captchaConfiguration: CaptchaConfiguration;
    contentLanguages: Language[] = [];
    termsAndConditionsUrl: string;
    privacyPolicyUrl: string;
    fileBlobId: string;
    vat: string;
    currencyDescriptor: CurrencyDescriptor;
    currency: string;
    vatIncluded: boolean;

    //
    bankAccount: string;
    bankAccountOwner: string[];
    //
    organizationEmail: string;




    // FIXME / CHECK:
    websiteUrl: string;
    shortName: string;
}
