import { Directive, OnInit, ElementRef, OnDestroy, Input } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appInvalidFeedback]'
})
export class InvalidFeedbackDirective implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

  @Input()
  invalidFeedbackInLabel: boolean;

  constructor(private element: ElementRef, private control : FormControlName, private translation: TranslateService) {
  }

  public ngOnInit(): void {
    this.control.statusChanges.subscribe(e => {
      this.checkValidation();
    });
  }

  private clearSubs(): void {
    this.subs.forEach(s => {
      s.unsubscribe();
    });
    this.subs = [];
  }

  public ngOnDestroy(): void {
    this.clearSubs();
  }

  private checkValidation(): void {

    let errorContainerElement: HTMLElement;

    if(this.invalidFeedbackInLabel) {
      errorContainerElement = this.element.nativeElement.parentElement.nextElementSibling;
    } else {
      errorContainerElement = this.element.nativeElement.nextElementSibling;
    }

    this.clearSubs();
    if (this.control.errors && this.control.errors.serverError && this.control.errors.serverError.length > 0) {
      this.element.nativeElement.classList.add('is-invalid');
      if(isInvalidFeedbackContainer(errorContainerElement)) {
        // remove messages that are already presents
        const rangeObj = new Range();
        rangeObj.selectNodeContents(errorContainerElement);
        rangeObj.deleteContents();
        this.addErrorMessages(errorContainerElement);
        //
      } else {
        const container = document.createElement('div');
        container.classList.add('invalid-feedback');
        this.addErrorMessages(container);
        if(this.invalidFeedbackInLabel) {
          container.classList.add('force-display')
          this.element.nativeElement.parentNode.insertAdjacentElement('afterEnd', container);
        } else {
          this.element.nativeElement.insertAdjacentElement('afterEnd', container);
        }
      }
    } else {
      this.element.nativeElement.classList.remove('is-invalid');
      if(isInvalidFeedbackContainer(errorContainerElement)) {
        errorContainerElement.remove();
      }
    }
  }

  private addErrorMessages(container: HTMLElement): void {
    this.control.errors.serverError.forEach(e => {
      const msg = document.createElement('div');
      this.subs.push(this.translation.stream(e).subscribe(text => {
        msg.textContent = text;
      }));
      container.appendChild(msg);
    });
  }

}

function isInvalidFeedbackContainer(container: HTMLElement): boolean {
  return container && container.classList.contains('invalid-feedback')
}



//<div class="invalid-feedback" *ngIf="contactAndTicketsForm.get('firstName').errors?.serverError">
//  <div *ngFor="let err of contactAndTicketsForm.get('firstName').errors.serverError" [translate]="err"></div>
//</div>

