import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfflinePaymentComponent } from './offline-payment.component';

describe('OfflineComponent', () => {
  let component: OfflinePaymentComponent;
  let fixture: ComponentFixture<OfflinePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfflinePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfflinePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
