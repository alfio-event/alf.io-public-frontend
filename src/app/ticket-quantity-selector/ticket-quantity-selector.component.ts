import {Component, Input} from "@angular/core";
import {TicketCategory} from "../model/ticket-category";
import {FormGroup} from "@angular/forms";

@Component({
  selector: 'app-ticket-quantity-selector',
  templateUrl: './ticket-quantity-selector.html'
})
export class TicketQuantitySelectorComponent {
  @Input()
  parentGroup: FormGroup;
  @Input()
  category: TicketCategory;
  @Input()
  quantityRange: number[];
  formGroup: FormGroup;
}
