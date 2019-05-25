import {Component, Inject, OnInit, NgZone} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export interface DialogData {
  id: number;
}

export interface LogElement {
  order?: number;
  action: string;
  ip: string;
  os: string;
  browser: string;
}

@Component({
    selector: 'app-user-log',
    templateUrl: './user-log.component.html',
    styleUrls: ['./user-log.component.scss']
  })
export class UserLogComponent implements OnInit {
  displayedColumns: string[] = ['order', 'action', 'ip', 'platform'];
  element_data: LogElement[] = [];
  dataSource: any = [];

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: DialogData,
              private httpClient: HttpClient,
              private _ngZone: NgZone) {
  }

  ngOnInit() {
    this._ngZone.runOutsideAngular( () => {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log('id: ', this.data.id);
    console.log('a: ' + environment.apiUrl);

      this.httpClient.get(environment.apiUrl + 'logs/' + this.data.id, {headers: headers}).subscribe(
        (res: any) => {
          this._ngZone.run(() => {
            res.logs.forEach(element => {
              this.dataSource.push({
                order: '0',
                action: element.action,
                ip: element.ip,
                os: element.useragent.os,
                browser: element.useragent.browser
              });
            });
            console.log('dataSource: ', this.dataSource);
          });
        },
        err => console.log('error', err)
      );
    });
  }

}
