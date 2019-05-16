export class TicketCategory {
    id: number;
    name: string;
    amountOfTickets: number[];
    description: {[key:string]: string}
    free: boolean;
    formattedFinalPrice: string;


    //
    expired: boolean;
    saleInFuture: boolean;
    formattedInception: {[key:string]: string};
    formattedExpiration: {[key:string]: string};
}