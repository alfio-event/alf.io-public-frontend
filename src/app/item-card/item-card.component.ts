import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {TicketCategory} from '../model/ticket-category';
import {AdditionalService} from '../model/additional-service';

@Component({
  selector: 'app-item-card',
  templateUrl: './item-card.html',
  styleUrls: ['./item-card.scss']
})
export class ItemCardComponent {
  @Input()
  parentFormGroup: FormGroup;

  @Input()
  item: TicketCategory | AdditionalService;

  @Input()
  additionalClass = '';

  @Input()
  currentLang: string;
}
