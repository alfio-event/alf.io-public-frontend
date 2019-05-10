import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OnsitePaymentProxyComponent } from './onsite-payment-proxy.component';

describe('OnsitePaymentProxyComponent', () => {
  let component: OnsitePaymentProxyComponent;
  let fixture: ComponentFixture<OnsitePaymentProxyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OnsitePaymentProxyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OnsitePaymentProxyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
