import { Component, OnInit } from '@angular/core';
import { InfoService } from '../shared/info.service';
import { Info } from '../model/info';

@Component({
  selector: 'app-banner-check',
  templateUrl: './banner-check.component.html',
  styleUrls: ['./banner-check.component.scss']
})
export class BannerCheckComponent implements OnInit {

  info: Info;
  secure: boolean;
  hideAlertInfo: boolean;

  constructor(private infoService: InfoService) { }

  ngOnInit() {
    this.infoService.getInfo().subscribe(info => {
      this.info = info;
      this.secure = location.protocol.indexOf('https:') === 0;
    });
  }

}
