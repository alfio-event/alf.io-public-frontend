import { PurchaseContextService } from "../shared/purchase-context.service";
import { AnalyticsConfiguration } from "./analytics-configuration";
import { AssignmentConfiguration, CaptchaConfiguration, CurrencyDescriptor, InvoicingConfiguration, Language } from "./event";
import { PurchaseContext } from "./purchase-context";

export class BasicSubscriptionInfo {
    id: string;
}

export class SubscriptionInfo implements PurchaseContext {
    id: string;

    //FIXME
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
}