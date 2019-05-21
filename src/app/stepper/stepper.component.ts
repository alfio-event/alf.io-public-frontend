import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent {

  @Input()
  free: boolean = true;

  @Input()
  currentStep: number = 1;

  @Input()
  inProgress: boolean = false;

  constructor() { }
}
