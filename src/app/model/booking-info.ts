import { Ticket } from './ticket';

export class BookingInfo {
    firstName: string;
    lastName: string;
    email: string;
    ticketsByCategory: TicketsByTicketCategory[];
}

export class TicketsByTicketCategory {
    name: string;
    tickets: Ticket[];
}