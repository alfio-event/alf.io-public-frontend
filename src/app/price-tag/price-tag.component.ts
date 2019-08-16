import { Component, Input, OnInit } from '@angular/core';
import { CurrencyDescriptor, Event } from '../model/event';

@Component({
  selector: 'app-price-tag',
  templateUrl: './price-tag.component.html'
})
export class PriceTagComponent implements OnInit {
  @Input()
  event: Event;
  @Input()
  formattedPrice: string;
  @Input()
  discountedPrice: string;
  @Input()
  showTaxDetails: boolean;
  @Input()
  displayTextInline: boolean;

  displayCurrencySymbol: boolean;
  currencyDescriptor: CurrencyDescriptor;

  ngOnInit(): void {
    this.currencyDescriptor = this.event.currencyDescriptor;
    this.displayCurrencySymbol = this.currencyDescriptor.symbol !== this.currencyDescriptor.code;
  }

  removeRedundantPrecision(input: string): string {
    const decimalSeparatorPosition = input.lastIndexOf('.');
    if (decimalSeparatorPosition > -1) {
      return input.substring(0, decimalSeparatorPosition);
    }
    return input;
  }
}
