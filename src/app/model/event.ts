export class Event {
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