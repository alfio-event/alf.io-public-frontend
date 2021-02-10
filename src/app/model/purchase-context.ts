import { AnalyticsConfiguration } from './analytics-configuration';
import { AssignmentConfiguration, CaptchaConfiguration, CurrencyDescriptor, InvoicingConfiguration, Language } from './event';

export interface PurchaseContext extends PurchaseContextPriceDescriptor {
    title: { [lang: string]: string };
    invoicingConfiguration: InvoicingConfiguration;
    assignmentConfiguration: AssignmentConfiguration;
    analyticsConfiguration: AnalyticsConfiguration;
    captchaConfiguration: CaptchaConfiguration;

    termsAndConditionsUrl: string;
    privacyPolicyUrl: string;

    contentLanguages: Language[];
    fileBlobId: string;

    currencyDescriptor: CurrencyDescriptor;
    vat: string;
    currency: string;
    vatIncluded: boolean;

    bankAccount: string;
    bankAccountOwner: string[];

    organizationEmail: string;

    //
    websiteUrl: string;
    shortName: string;

    canApplySubscriptions: boolean;
}

export interface PurchaseContextPriceDescriptor {
  currencyDescriptor: CurrencyDescriptor;
  vat: string;
  currency: string;
  vatIncluded: boolean;
}
