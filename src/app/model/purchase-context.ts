import { AnalyticsConfiguration } from "./analytics-configuration";
import { AssignmentConfiguration, CaptchaConfiguration, CurrencyDescriptor, InvoicingConfiguration, Language } from "./event";

export interface PurchaseContext {
    displayName: string;
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
}