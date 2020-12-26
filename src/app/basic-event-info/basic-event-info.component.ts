import { Component, OnInit, Input } from '@angular/core';
import { BasicEventInfo } from '../model/basic-event-info';

@Component({
  selector: 'app-basic-event-info',
  templateUrl: './basic-event-info.component.html',
  styleUrls: ['./basic-event-info.component.scss']
})
export class BasicEventInfoComponent implements OnInit {

  @Input()
  event: BasicEventInfo;

  constructor() { }

  ngOnInit(): void {
  }


  public get isEventOnline(): boolean {
    return this.event.format === 'ONLINE';
  }

}
