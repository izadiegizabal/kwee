import { Component, OnInit } from '@angular/core';
import {Title} from '@angular/platform-browser';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../store/app.reducers';
import {Observable} from 'rxjs';
import * as fromAuth from '../auth/store/auth.reducers';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  authState: Observable<fromAuth.State>;

  constructor(private titleService: Title,
              private store$: Store<fromApp.AppState>) { }

  ngOnInit() {
    this.titleService.setTitle('Kwee - Settings');
    this.authState = this.store$.pipe(select('auth'));
  }

}
