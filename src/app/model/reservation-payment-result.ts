export class ReservationPaymentResult {
    success: boolean;
    failed: boolean;
    redirect: boolean;
    redirectUrl: string;
    gatewayIdOrNull: string;
}
