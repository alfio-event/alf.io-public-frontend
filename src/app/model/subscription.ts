import { PurchaseContextService } from "../shared/purchase-context.service";
import { AnalyticsConfiguration } from "./analytics-configuration";
import { AssignmentConfiguration, InvoicingConfiguration } from "./event";
import { PurchaseContext } from "./purchase-context";

export class BasicSubscriptionInfo {
    id: string;
}

export class SubscriptionInfo implements PurchaseContext {
    id: string;

    //FIXME
    displayName: string;
    invoicingConfiguration: InvoicingConfiguration = new InvoicingConfiguration()
    assignmentConfiguration: AssignmentConfiguration = new AssignmentConfiguration();
    analyticsConfiguration: AnalyticsConfiguration = new AnalyticsConfiguration();
}