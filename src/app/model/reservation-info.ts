import { Ticket } from './ticket';

export class ReservationInfo {
    firstName: string;
    lastName: string;
    email: string;
    validity: number;
    ticketsByCategory: TicketsByTicketCategory[];
    orderSummary: OrderSummary;
}

export class TicketsByTicketCategory {
    name: string;
    tickets: Ticket[];
}

export class OrderSummary {
    summary: SummaryRow[];
    totalPrice: string;
    free: boolean;
    displayVat: boolean;
}

export class SummaryRow {
    name: string;
    amount: number;
    price: string;
    subTotal: string;
}