import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerCheckComponent } from './banner-check.component';

describe('BannerCheckComponent', () => {
  let component: BannerCheckComponent;
  let fixture: ComponentFixture<BannerCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
