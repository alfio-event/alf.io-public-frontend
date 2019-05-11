import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StripePaymentProxyComponent } from './stripe-payment-proxy.component';

describe('StripePaymentProxyComponent', () => {
  let component: StripePaymentProxyComponent;
  let fixture: ComponentFixture<StripePaymentProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StripePaymentProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StripePaymentProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
