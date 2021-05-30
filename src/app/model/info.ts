import { AnalyticsConfiguration } from './analytics-configuration';
import {InvoicingConfiguration, TermsPrivacyLinksContainer} from './event';

export class Info {
  demoModeEnabled: boolean;
  devModeEnabled: boolean;
  prodModeEnabled: boolean;
  analyticsConfiguration: AnalyticsConfiguration;
  globalPrivacyPolicyUrl?: string;
  globalTermsUrl?: string;
  invoicingConfiguration?: InvoicingConfiguration;
}

export function globalTermsPrivacyLinks(info: Info): TermsPrivacyLinksContainer {
  return { privacyPolicyUrl: info.globalPrivacyPolicyUrl, termsAndConditionsUrl: info.globalTermsUrl };
}
