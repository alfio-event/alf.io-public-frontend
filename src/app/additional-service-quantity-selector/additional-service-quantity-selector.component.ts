import {Component, Input} from "@angular/core";
import {AdditionalService} from "../model/additional-service";
import {Event} from "../model/event";

@Component({
  selector: 'app-additional-service-quantity-selector',
  templateUrl: './additional-service-quantity-selector.html'
})
export class AdditionalServiceQuantitySelectorComponent {

  @Input()
  additionalService: AdditionalService;

  @Input()
  validSelectionValues: number[];

  @Input()
  event: Event;

}
