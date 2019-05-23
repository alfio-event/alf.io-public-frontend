import { Component, Input } from '@angular/core';
import { AdditionalService } from '../model/additional-service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-additional-service',
  templateUrl: './additional-service.component.html'
})
export class AdditionalServiceComponent {

  @Input()
  additionalService: AdditionalService;

  constructor(public translate: TranslateService) { }

}
