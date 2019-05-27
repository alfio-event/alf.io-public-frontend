import { Directive, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { FormControlName } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[appInvalidFeedback]'
})
export class InvalidFeedbackDirective implements OnInit, OnDestroy {

  private subs: Subscription[] = [];

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

    let nextElem: HTMLElement = this.element.nativeElement.nextElementSibling;
    this.clearSubs();
    if (this.control.errors && this.control.errors.serverError && this.control.errors.serverError.length > 0) {
      this.element.nativeElement.classList.add('is-invalid');
      if(isInvalidFeedbackContainer(nextElem)) {
        // remove messages that are already presents
        const rangeObj = new Range();
        rangeObj.selectNodeContents(nextElem);
        rangeObj.deleteContents();
        this.addErrorMessages(nextElem);
        //
      } else {
        const container = document.createElement('div');
        container.classList.add('invalid-feedback');
        this.addErrorMessages(container);
        this.element.nativeElement.parentNode.insertBefore(container, this.element.nativeElement.nextSibling);
      }
    } else {
      this.element.nativeElement.classList.remove('is-invalid');
      if(isInvalidFeedbackContainer(nextElem)) {
        nextElem.remove();
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

