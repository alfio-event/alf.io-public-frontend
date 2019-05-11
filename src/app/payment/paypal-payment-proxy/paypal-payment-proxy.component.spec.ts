import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaypalPaymentProxyComponent } from './paypal-payment-proxy.component';

describe('PaypalPaymentProxyComponent', () => {
  let component: PaypalPaymentProxyComponent;
  let fixture: ComponentFixture<PaypalPaymentProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaypalPaymentProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaypalPaymentProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
