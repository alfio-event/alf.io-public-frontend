import {Component, Input} from "@angular/core";
import {TicketCategory} from "../model/ticket-category";
import {AdditionalService} from "../model/additional-service";

@Component({
  selector: 'app-category-sale-period',
  templateUrl: './category-sale-period.html'
})
export class CategorySalePeriodComponent {
  @Input()
  category: TicketCategory | AdditionalService;
  @Input()
  currentLang: string;
}
