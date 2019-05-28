import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatTableDataSource, MatPaginator, MatSort} from '@angular/material';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../../../environments/environment';

export interface DialogData {
  id: number;
}

export interface LogElement {
  order: number;
  date: Date;
  hour: Date;
  action: string;
  actionToRoute: string;
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
  displayedColumns: string[] = ['order', 'date', 'hour', 'action', 'actionToRoute', 'ip', 'os', 'browser'];
  element_data: LogElement[] = [];
  dataSource: MatTableDataSource<LogElement>;

  pageSizeOptions = [10, 50, 100];
  sort: MatSort;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) set matSort(sort: MatSort) {
    if (this.dataSource) {this.dataSource.sort = sort; }
    this.sort = sort;
  }

  constructor(@Inject(MAT_DIALOG_DATA)
              public data: DialogData,
              private httpClient: HttpClient,
              ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    console.log('id: ', this.data.id);

      this.httpClient.get(environment.apiUrl + 'logs/' + this.data.id, {headers: headers}).subscribe(
        (res: any) => {
          this.dataSource.data = res.logs.map((element, i) => {
              return {
                order: i + 1,
                date: element.date,
                hour: element.hour,
                action: element.action,
                actionToRoute: element.actionToRoute,
                ip: element.ip,
                os: element.useragent.os,
                browser: element.useragent.browser
              };
            });
            this.dataSource.sort = this.sort;
            this.dataSource.paginator = this.paginator;
            this.pageSizeOptions.sort();
        },
        err => console.log('error', err)
      );
  }

}
