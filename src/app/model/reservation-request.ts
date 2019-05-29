export class ReservationRequest {
    promoCode: string;
    reservation: TicketReservation[];
    additionalService: SelectedAdditionalService[];
    captcha: string;
}

export class TicketReservation {
    ticketCategoryId: number;
    amount: number;
}

export class SelectedAdditionalService {
}