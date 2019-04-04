import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss']
})
export class StepperComponent implements OnInit {

  @Input()
  free: boolean = true;

  @Input()
  currentStep: number = 1;

  constructor() { }

  ngOnInit() {
  }

}
