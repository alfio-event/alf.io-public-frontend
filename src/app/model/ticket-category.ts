export class TicketCategory {
    id: number;
    name: string;
    maximumSaleableTickets: number;
    description: {[key: string]: string};
    free: boolean;
    formattedFinalPrice: string;
    hasDiscount: boolean;
    formattedDiscountedPrice: string;


    //
    expired: boolean;
    saleInFuture: boolean;
    formattedInception: {[key: string]: string};
    formattedExpiration: {[key: string]: string};
    //

    saleableAndLimitNotReached: boolean;
    accessRestricted: boolean;
    soldOutOrLimitReached: boolean;
}
