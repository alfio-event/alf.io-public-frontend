import { Observable, of } from 'rxjs';

export interface PaymentProvider {
    pay(): Observable<PaymentResult>;
}

export class PaymentResult {
    constructor(public success: boolean, public gatewayToken: string) {}
}

export class SimplePaymentProvider implements PaymentProvider {

    pay(): Observable<PaymentResult> {
        return of(new PaymentResult(true, null));
    }
}
