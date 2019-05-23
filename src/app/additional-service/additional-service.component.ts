import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AdditionalService } from '../model/additional-service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Event } from '../model/event';

@Component({
  selector: 'app-additional-service',
  templateUrl: './additional-service.component.html',
  styleUrls: ['./additional-service.component.scss']
})
export class AdditionalServiceComponent implements OnInit, OnDestroy {

  @Input()
  additionalService: AdditionalService;

  @Input()
  form: FormGroup;

  additionalServiceFormGroup: FormGroup;

  @Input()
  event: Event;

  private formSub: Subscription;

  constructor(public translate: TranslateService, private formBuilder: FormBuilder) { }

  public ngOnInit(): void {

    const fa = this.form.get('additionalService') as FormArray;

    if(this.additionalService.fixPrice) {
      this.additionalServiceFormGroup = this.formBuilder.group({additionalServiceId: this.additionalService.id, quantity: null});
    } else {
      this.additionalServiceFormGroup = this.formBuilder.group({additionalServiceId: this.additionalService.id, amount: null});
    }
    fa.push(this.additionalServiceFormGroup)

    //we only need to recalculate the select box choice in this specific supplement policy!
    if (this.additionalService.supplementPolicy === 'OPTIONAL_MAX_AMOUNT_PER_TICKET') {
      this.formSub = this.form.get('reservation').valueChanges.subscribe(valueChange => {
        console.log('value changed!', valueChange);
      });
    }
  }

  public ngOnDestroy(): void {
    if (this.formSub) {
      this.formSub.unsubscribe();
    }
  }

}
