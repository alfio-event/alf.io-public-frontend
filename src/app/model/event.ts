import { DateValidity } from './date-validity';

export class Event implements DateValidity {
    shortName: string;
    displayName: string;
    fileBlobId: string;
    contentLanguages: Language[];
    websiteUrl: string;
    location: string;
    privacyPolicyUrl: string;
    termsAndConditionsUrl: string;
    mapUrl:string;

    organizationName: string;
    organizationEmail: string;

    description: {[key:string]: string};
    vatIncluded: boolean;
    vat: string;
    free: boolean;

    //
    activePaymentMethods: {[key in PaymentMethod]?: PaymentProxyWithParameters};

    //
    userCanDownloadReceiptOrInvoice: boolean;
    bankAccount: string;
    bankAccountOwner: string[];
    //
    currency: string;

    //date related
    timeZone: string;
    sameDay: boolean;
    formattedBeginDate: {[key:string]: string}; // day, month, year
    formattedBeginTime: {[key:string]: string}; //the hour/minute component
    formattedEndDate: {[key:string]: string};
    formattedEndTime: {[key:string]: string};
    //

    //
    invoicingConfiguration: InvoicingConfiguration;
    //
    captchaConfiguration : CaptchaConfiguration;
}

export class InvoicingConfiguration {
    euVatCheckingEnabled: boolean;
    invoiceAllowed: boolean;
    onlyInvoice: boolean;
    customerReferenceEnabled: boolean;
    enabledItalyEInvoicing: boolean;
    vatNumberStrictlyRequired: boolean;
}

export class Language {
    locale: string;
    displayLanguage: string;
}

export class PaymentProxyWithParameters {
    paymentProxy: PaymentProxy;
    parameters: {[key:string]: any}
}

export type PaymentMethod = 'CREDIT_CARD' | 'PAYPAL' | 'IDEAL' | 'BANK_TRANSFER' | 'ON_SITE' | 'NONE'
export type PaymentProxy = 'STRIPE' | 'ON_SITE' | 'OFFLINE' | 'PAYPAL'

export class CaptchaConfiguration {
    captchaForTicketSelection: boolean;
    captchaForOfflinePayment: boolean;
    recaptchaApiKey: string;
}