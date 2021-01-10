import { AnalyticsConfiguration } from "./analytics-configuration";
import { AssignmentConfiguration, InvoicingConfiguration } from "./event";

export interface PurchaseContext {
    displayName: string;
    invoicingConfiguration: InvoicingConfiguration;
    assignmentConfiguration: AssignmentConfiguration;
    analyticsConfiguration: AnalyticsConfiguration;
}