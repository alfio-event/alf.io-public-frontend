import { Ticket } from './ticket';

export class ReservationInfo {
    id: string;
    shortId: string;
    firstName: string;
    lastName: string;
    email: string;
    validity: number;
    ticketsByCategory: TicketsByTicketCategory[];
    orderSummary: OrderSummary;

    //
    status: ReservationStatus;
    validatedBookingInformations: boolean;
    //
    formattedExpirationDate: {[key:string]: string};
    //
    invoiceNumber: string;
    
}

export class ReservationStatusInfo {
    status: ReservationStatus;
    validatedBookingInformations: boolean;
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

export type ReservationStatus = 'PENDING' | 'IN_PAYMENT' | 'EXTERNAL_PROCESSING_PAYMENT' | 
                                'WAITING_EXTERNAL_CONFIRMATION' | 'OFFLINE_PAYMENT' | 
                                'COMPLETE' | 'STUCK' | 'CANCELLED' | 'CREDIT_NOTE_ISSUED';