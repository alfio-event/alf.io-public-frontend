import { Observable, of } from 'rxjs';

export interface PaymentProvider {
    ready: Observable<boolean>;
}

export class SimplePaymentProvider implements PaymentProvider {
    get ready(): Observable<boolean> {
        return of(true);
    }
}