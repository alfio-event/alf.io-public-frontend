import {Component, Input, OnChanges, SimpleChanges} from "@angular/core";
import {TicketCategory} from "../model/ticket-category";
import {FormArray, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-ticket-quantity-selector',
  templateUrl: './ticket-quantity-selector.html'
})
export class TicketQuantitySelectorComponent implements OnChanges {
  @Input()
  parentGroup: FormGroup;
  @Input()
  category: TicketCategory;
  @Input()
  quantityRange: number[];
  formGroup: FormGroup;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes', changes);
  }
}
