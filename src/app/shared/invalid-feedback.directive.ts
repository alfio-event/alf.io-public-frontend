import { Directive, OnInit, ElementRef } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Directive({
  selector: '[appInvalidFeedback]'
})
export class InvalidFeedbackDirective implements OnInit {

  constructor(private element: ElementRef, private control : FormControlName, private transation: TranslateService) {
  }

  ngOnInit(): void {
    this.control.statusChanges.subscribe(e => {
      this.checkValidation();
    });
  }

  checkValidation(): void {
    if (this.control.errors && this.control.errors.serverError && this.control.errors.serverError.length > 0) {
      this.element.nativeElement.classList.add('is-invalid')
    } else {
      this.element.nativeElement.classList.remove('is-invalid')
    }
  }

}

//<div class="invalid-feedback" *ngIf="contactAndTicketsForm.get('firstName').errors?.serverError">
//  <div *ngFor="let err of contactAndTicketsForm.get('firstName').errors.serverError" [translate]="err"></div>
//</div>

