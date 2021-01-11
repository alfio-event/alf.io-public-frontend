import { AnalyticsConfiguration } from "./analytics-configuration";
import { AssignmentConfiguration, InvoicingConfiguration, Language } from "./event";

export interface PurchaseContext {
    displayName: string;
    invoicingConfiguration: InvoicingConfiguration;
    assignmentConfiguration: AssignmentConfiguration;
    analyticsConfiguration: AnalyticsConfiguration;

    termsAndConditionsUrl: string;
    privacyPolicyUrl: string;

    contentLanguages: Language[];
    fileBlobId: string;
}