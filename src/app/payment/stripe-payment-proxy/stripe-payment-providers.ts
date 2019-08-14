import { Event } from 'src/app/model/event';
import { Observable, Subscriber } from 'rxjs';
import { PaymentProvider, PaymentResult } from '../payment-provider';
import { TranslateService } from '@ngx-translate/core';
import { ReservationInfo } from 'src/app/model/reservation-info';
import { ReservationService } from 'src/app/shared/reservation.service';

// global variable defined by stripe when the scripts are loaded
declare const StripeCheckout: any;
//

export const STRIPE_CHECKOUT_ID_SCRIPT = 'stripe-payment-proxy-checkout';

export class StripeCheckoutPaymentProvider implements PaymentProvider {

    constructor(
        private translate: TranslateService,
        private parameters: { [key: string]: any },
        private reservation: ReservationInfo,
        private event: Event) {
    }

    pay(): Observable<PaymentResult> {
        const obs = new Observable<PaymentResult>(subscriber => {
            this.loadScript(subscriber);
        });
        return obs;
    }

    loadScript(subscriber: Subscriber<PaymentResult>) {
        if (!document.getElementById(STRIPE_CHECKOUT_ID_SCRIPT)) {
            const scriptElem = document.createElement('script');
            scriptElem.id = STRIPE_CHECKOUT_ID_SCRIPT;
            scriptElem.src = 'https://checkout.stripe.com/checkout.js';
            scriptElem.async = true;
            scriptElem.defer = true;
            scriptElem.addEventListener('load', () => {
                this.configureAndOpen(subscriber);
            });
            document.body.appendChild(scriptElem);
        } else if (!window['StripeCheckout']) {
            document.getElementById(STRIPE_CHECKOUT_ID_SCRIPT).addEventListener('load', () => {
                this.configureAndOpen(subscriber);
            });
        } else {
            this.configureAndOpen(subscriber);
        }
    }

    configureAndOpen(subscriber: Subscriber<PaymentResult>) {
        let tokenSubmitted = false;
        const stripeHandler = StripeCheckout.configure({
            key: this.parameters['stripe_p_key'],
            locale: this.translate.currentLang,
            token: (token) => {
                tokenSubmitted = true;
                subscriber.next(new PaymentResult(true, token.id));
            },
            closed: () => {
                if (!tokenSubmitted) {
                    subscriber.next(new PaymentResult(false, null));
                }
            }
        });
        stripeHandler.open({
            name: `${this.reservation.firstName} ${this.reservation.lastName}`,
            description: this.reservation.orderSummary.descriptionForPayment,
            zipCode: false,
            allowRememberMe: false,
            amount: this.reservation.orderSummary.priceInCents,
            currency: this.event.currency,
            email: this.reservation.email
        });
    }
}

export class StripePaymentV3 implements PaymentProvider {

    constructor(
        private reservationService: ReservationService,
        private event: Event,
        private reservation: ReservationInfo,
        private stripeHandler: any,
        private card: any
    ) {
    }

    pay(): Observable<PaymentResult> {

        const obs = new Observable<PaymentResult>(subscriber => {

            this.reservationService.initPayment(this.event.shortName, this.reservation.id).subscribe(res => {
                const clientSecret = res.clientSecret;

                this.stripeHandler.handleCardPayment(clientSecret, this.card, {
                    payment_method_data: {
                        billing_details: {
                            name: `${this.reservation.firstName} ${this.reservation.lastName}`,
                            email: this.reservation.email,
                            /*address: {
                                 line1: stripeEl.getAttribute('data-stripe-contact-address'),
                                 postal_code: stripeEl.getAttribute('data-stripe-contact-zip'),
                                 country: stripeEl.getAttribute('data-stripe-contact-country').toLowerCase()
                            }*/
                        }
                    }
                }).then(cardPaymentResult => {
                    if (cardPaymentResult.error) {
                        console.log('error!');
                    } else {
                        let handleCheck;
                        const checkIfPaid = () => {
                            this.reservationService.getPaymentStatus(this.event.shortName, this.reservation.id).subscribe(status => {
                                if (status.success) {
                                    clearInterval(handleCheck);
                                    subscriber.next(new PaymentResult(true, status.gatewayIdOrNull));
                                }
                                if (status.failed) {
                                    subscriber.next(new PaymentResult(false, null));
                                }
                            });
                        };
                        handleCheck = setInterval(checkIfPaid, 1000);
                    }
                });
            });
        });
        return obs;
    }
}
