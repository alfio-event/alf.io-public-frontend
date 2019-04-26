export class ReservationRequest {
    promoCode: string;
    reservation: TicketReservation[];
    additionalService: AdditionalService[];
}

export class TicketReservation {
    ticketCategoryId: number;
    amount: number;
}

export class AdditionalService {
}