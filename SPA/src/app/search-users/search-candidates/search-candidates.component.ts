import { Component, OnInit } from '@angular/core';
import {Observable} from 'rxjs';
import * as fromAdmin from '../../admin/store/admin.reducers';
import {PageEvent} from '@angular/material';
import {select, Store} from '@ngrx/store';
import * as fromApp from '../../store/app.reducers';
import * as AdminActions from '../../admin/store/admin.actions';
import {AdminEffects} from '../../admin/store/admin.effects';

@Component({
  selector: 'app-search-candidates',
  templateUrl: './search-candidates.component.html',
  styleUrls: ['./search-candidates.component.scss']
})
export class SearchCandidatesComponent implements OnInit {

  // paging
  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 25, 100];

  // MatPaginator Output
  pageEvent: PageEvent;
  // -----

  adminState: Observable<fromAdmin.State>;

  constructor(private store$: Store<fromApp.AppState>) { }

  ngOnInit() {
    console.log('init');
    this.store$.dispatch(new AdminActions.TryGetCandidates({page: 1, limit: 5}));
    this.adminState = this.store$.pipe(select(state => state.admin));
  }

  changepage() {
    this.store$.dispatch(new AdminActions.TryGetCandidates({page: this.pageEvent.pageIndex + 1, limit: this.pageEvent.pageSize}));
  }
}
