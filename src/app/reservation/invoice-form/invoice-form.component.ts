import { Component, OnInit, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-invoice-form',
  templateUrl: './invoice-form.component.html'
})
export class InvoiceFormComponent implements OnInit {

  @Input()
  form: FormGroup;

  constructor() { }

  ngOnInit() {
  }

}
