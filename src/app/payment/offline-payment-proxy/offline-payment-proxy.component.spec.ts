import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePaymentProxyComponent } from './offline-payment-proxy.component';

describe('OfflinePaymentProxyComponent', () => {
  let component: OfflinePaymentProxyComponent;
  let fixture: ComponentFixture<OfflinePaymentProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinePaymentProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePaymentProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
