export class Event {
    displayName: string;
    fileBlobIdIsPresent: boolean;
    fileBlobId: string;
    imageUrl: string;
    contentLanguages: ContentLanguage[];

    organizationName: string;
    organizationEmail: string;
}

export class ContentLanguage {
    locale: string;
    value: number;
    flag: string;
    language: string;
    displayLanguage: string;
}

export class LocationDescriptor {
    timeZone: string;
    latitude: string;
    longitude: string;
    mapUrl: string;
}