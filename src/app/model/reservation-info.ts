import { Ticket } from './ticket';

export class ReservationInfo {
    firstName: string;
    lastName: string;
    email: string;
    ticketsByCategory: TicketsByTicketCategory[];
}

export class TicketsByTicketCategory {
    name: string;
    tickets: Ticket[];
}