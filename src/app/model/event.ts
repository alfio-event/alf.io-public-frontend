export class Event {
    shortName: string;
    displayName: string;
    fileBlobIdIsPresent: boolean;
    fileBlobId: string;
    imageUrl: string;
    contentLanguages: ContentLanguage[];
    websiteUrl: string;
    location: string;
    privacyPolicyUrl: string;
    termsAndConditionsUrl: string;
    mapUrl:string;

    organizationName: string;
    organizationEmail: string;

    description: {[key:string]: string}
}

export class ContentLanguage {
    locale: string;
    value: number;
    flag: string;
    language: string;
    displayLanguage: string;
}