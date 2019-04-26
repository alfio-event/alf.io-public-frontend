export class TicketCategories {
    categories: TicketCategory[];
}


export class TicketCategory {
    id: number;
    name: string;
    amountOfTickets: number[];
    description: {[key:string]: string}
    free: boolean;
}