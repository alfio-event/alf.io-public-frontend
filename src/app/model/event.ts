export class Event {
    shortName: string;
    displayName: string;
    fileBlobId: string;
    contentLanguages: ContentLanguage[];
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

    activePaymentMethods: PaymentProxy[];
}

export class ContentLanguage {
    locale: string;
    displayLanguage: string;
}

export type PaymentProxy = 'STRIPE' | 'ON_SITE' | 'OFFLINE' | 'PAYPAL'