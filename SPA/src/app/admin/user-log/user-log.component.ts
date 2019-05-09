import {Component, OnInit, Inject} from '@angular/core';
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
              private httpClient: HttpClient) { }

  ngOnInit() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log('id: ', this.data.id);
    this.httpClient.get(environment.apiUrl + 'logs/' + this.data.id, {headers: headers}).subscribe(
      res => this.logs = res,
      err => console.log('error')
    );
  }

}
