import {Component, Input, OnInit} from "@angular/core";
import {CurrencyDescriptor, Event} from '../model/event';

@Component({
  selector: 'app-price-tag',
  template: `
    <div class="d-inline-flex flex-column">
      <div class="text-align-right">
          <span *ngIf="displayCurrencySymbol" [class.mr-2]="!displayTextInline">{{currencyDescriptor.symbol}}</span><ng-container *ngIf="displayTextInline">{{' '}}</ng-container>
          <span *ngIf="discountedPrice != null" class="text-align-right"><del>{{formattedPrice}}</del>{{' '}}<mark>{{discountedPrice}}</mark></span>
          <span *ngIf="discountedPrice == null" class="text-align-right">{{formattedPrice}}</span>
          <span *ngIf="!displayCurrencySymbol" [class.mr-2]="!displayTextInline">{{currencyDescriptor.code}}</span>
      </div>
      <small *ngIf="showTaxDetails" class="text-align-right text-muted"><i>{{(event.vatIncluded ? 'show-event.incVat' : 'show-event.excVat') | translate:{'0': removeRedundantPrecision(event.vat), '1': ('common.vat' | translate)} }}</i></small>  
    </div>
  `
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
    if(decimalSeparatorPosition > -1) {
      return input.substring(0, decimalSeparatorPosition);
    }
    return input;
  }
}
