import { Component, Input } from '@angular/core';
import { PaymentMethod, PaymentProxyWithParameters, PaymentMethodDetails, paymentMethodDetails, Event } from 'src/app/model/event';
import { PaymentProvider } from 'src/app/payment/payment-provider';
import { FormGroup } from '@angular/forms';
import { ReservationInfo } from 'src/app/model/reservation-info';

@Component({
    selector: 'app-payment-method-selector',
    templateUrl: './payment-method-selector.component.html'
})
export class PaymentMethodSelectorComponent {

    @Input()
    activePaymentMethods: {[key in PaymentMethod]?: PaymentProxyWithParameters};
    @Input()
    event: Event;
    @Input()
    reservationInfo: ReservationInfo;
    @Input()
    overviewForm: FormGroup;

    selectedPaymentMethod: PaymentMethod;
    selectedPaymentProvider: PaymentProvider;

    get activePaymentsCount(): number {
        return Object.keys(this.activePaymentMethods).length;
    }

    get verticalLayout(): boolean {
        return this.activePaymentsCount > 3;
    }

    getPaymentMethodDetails(pm: PaymentMethod): PaymentMethodDetails  {
        return paymentMethodDetails[pm];
    }

    registerCurrentPaymentProvider(paymentProvider: PaymentProvider) {
        this.selectedPaymentProvider = paymentProvider;
    }

    paymentMethodSelected(paymentMethod: PaymentMethod, proxy: PaymentProxyWithParameters) {
        this.overviewForm.get('paymentProxy').setValue(proxy.paymentProxy);
        this.overviewForm.get('selectedPaymentMethod').setValue(paymentMethod);
    }

}
