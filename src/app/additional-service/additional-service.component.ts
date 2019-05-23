import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { AdditionalService } from '../model/additional-service';
import { TranslateService } from '@ngx-translate/core';
import { FormGroup } from '@angular/forms';
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

  @Input()
  event: Event;

  private formSub: Subscription;

  constructor(public translate: TranslateService) { }

  public ngOnInit(): void {

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
