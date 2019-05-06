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
}

export class ContentLanguage {
    locale: string;
    value: number;
    flag: string;
    language: string;
    displayLanguage: string;
}