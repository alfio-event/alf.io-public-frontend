import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalFieldComponent } from './additional-field.component';

describe('AdditionalFieldComponent', () => {
  let component: AdditionalFieldComponent;
  let fixture: ComponentFixture<AdditionalFieldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdditionalFieldComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
