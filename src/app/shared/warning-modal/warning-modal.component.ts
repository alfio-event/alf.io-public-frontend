import {Component, Input} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html'
})
export class WarningModalComponent {

  @Input()
  message: string;

  constructor(public activeModal: NgbActiveModal) {}
}
