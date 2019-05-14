import {Component, Inject, OnInit, NgZone} from '@angular/core';
import {MAT_DIALOG_DATA} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export interface DialogData {
  id: number;
}

@Component({
  selector: 'app-user-log',
  templateUrl: './user-log.component.html',
  styleUrls: ['./user-log.component.scss']
})
export class UserLogComponent implements OnInit {

  logs: any = [];

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: DialogData,
              private httpClient: HttpClient,
              private _ngZone: NgZone) {
  }

  ngOnInit() {
    this._ngZone.runOutsideAngular( () => {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log('id: ', this.data.id);
      this.httpClient.get(environment.apiUrl + 'logs/' + this.data.id, {headers: headers}).subscribe(
        res => {
          this._ngZone.run(() => {
            this.logs = res;
            console.log('logs: ', this.logs);
          });
        },
        err => console.log('error')
      );
    });
  }

}
