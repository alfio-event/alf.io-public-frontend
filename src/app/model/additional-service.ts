export class AdditionalService {
    id: number;
    type: AdditionalServiceType;
    supplementPolicy: SupplementPolicy;
    //
    fixPrice: boolean;
    availableQuantity: number;
    maxQtyPerOrder: number;
    //
    expired: boolean;
    saleInFuture: boolean;
    formattedInception: {[key:string]: string};
    formattedExpiration: {[key:string]: string};
    title: {[key:string]: string};
    description: {[key:string]: string};

    //TODO: check if we can remove it
    amounts: number[];
}

export type AdditionalServiceType = 'DONATION' | 'SUPPLEMENT';
export type SupplementPolicy = 'MANDATORY_ONE_FOR_TICKET' | 'OPTIONAL_UNLIMITED_AMOUNT' | 'OPTIONAL_MAX_AMOUNT_PER_TICKET' | 'OPTIONAL_MAX_AMOUNT_PER_RESERVATION';